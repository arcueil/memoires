#!/usr/bin/env python3
"""Grade the folklore "spike-and-slab is bad under HMC" by experiment (BlackJAX NUTS).

Fair test: the MARGINALIZED spike-and-slab (discrete inclusion integrated out -> a continuous
two-component Gaussian-mixture prior per coefficient) is the HMC-able version. We compare its
sampling geometry + recovery against the regularized (Finnish) horseshoe on the SAME sparse
linear-regression data, same sampler (NUTS + window adaptation).

  uv run --with blackjax --with jax python experiments/spike_slab_vs_horseshoe.py
"""
import time, functools
import jax, jax.numpy as jnp
from jax.scipy.stats import norm
from jax.scipy.special import logsumexp
import numpy as np
import blackjax

jax.config.update("jax_enable_x64", True)
SEED = 0
N, P, K = 100, 50, 5            # obs, predictors, true non-zeros (sparse)
SIGMA_TRUE = 1.0
NUM_WARMUP, NUM_SAMPLES, NUM_CHAINS = 1000, 2000, 4

# ---- data ----
rng = np.random.default_rng(SEED)
X = rng.standard_normal((N, P))
beta_true = np.zeros(P)
beta_true[:K] = rng.choice([-3., -2., 2., 3., 2.5], size=K, replace=True)
y = X @ beta_true + SIGMA_TRUE * rng.standard_normal(N)
X_j, y_j, beta_true_j = jnp.asarray(X), jnp.asarray(y), jnp.asarray(beta_true)

def half_cauchy_logpdf(v, scale):     # v>0
    return jnp.log(2.0) - jnp.log(jnp.pi) - jnp.log(scale) - jnp.log1p((v/scale)**2)
def half_normal_logpdf(v, scale):
    return 0.5*jnp.log(2/jnp.pi) - jnp.log(scale) - 0.5*(v/scale)**2
def inv_gamma_logpdf(x, a, b):
    return a*jnp.log(b) - jax.scipy.special.gammaln(a) - (a+1)*jnp.log(x) - b/x

# ---- Model A: regularized (Finnish) horseshoe, CENTERED (the naive/funnel-prone form) ----
TAU0 = (K/(P-K)) * SIGMA_TRUE / jnp.sqrt(N)   # Piironen-Vehtari global scale
SLAB_SCALE, SLAB_DF = 2.0, 4.0
def _reg_local_scale(tau, lam, c2):
    return tau*jnp.sqrt(c2*lam**2 / (c2 + tau**2*lam**2))   # regularized local scale (Finnish)
def horseshoe_c_logdensity(pos):
    beta = pos["beta"]; lt = pos["log_tau"]; ll = pos["log_lambda"]; lc = pos["log_c2"]; ls = pos["log_sigma"]
    tau, lam, c2, sigma = jnp.exp(lt), jnp.exp(ll), jnp.exp(lc), jnp.exp(ls)
    lp  = half_cauchy_logpdf(tau, TAU0) + lt
    lp += jnp.sum(half_cauchy_logpdf(lam, 1.0) + ll)
    lp += inv_gamma_logpdf(c2, SLAB_DF/2, SLAB_DF/2*SLAB_SCALE**2) + lc
    lp += half_normal_logpdf(sigma, 1.0) + ls
    lp += jnp.sum(norm.logpdf(beta, 0.0, _reg_local_scale(tau, lam, c2)))   # CENTERED: beta ~ N(0, scale)
    lp += jnp.sum(norm.logpdf(y_j, X_j @ beta, sigma))
    return lp
hs_c_init = lambda key: {"beta": 0.01*jax.random.normal(key,(P,)), "log_tau": jnp.array(-1.0),
    "log_lambda": jnp.zeros(P), "log_c2": jnp.array(0.0), "log_sigma": jnp.array(0.0)}

# ---- Model A': regularized horseshoe, NON-CENTERED (the standard, funnel-free form) ----
def horseshoe_nc_logdensity(pos):
    z = pos["beta_raw"]; lt = pos["log_tau"]; ll = pos["log_lambda"]; lc = pos["log_c2"]; ls = pos["log_sigma"]
    tau, lam, c2, sigma = jnp.exp(lt), jnp.exp(ll), jnp.exp(lc), jnp.exp(ls)
    lp  = half_cauchy_logpdf(tau, TAU0) + lt
    lp += jnp.sum(half_cauchy_logpdf(lam, 1.0) + ll)
    lp += inv_gamma_logpdf(c2, SLAB_DF/2, SLAB_DF/2*SLAB_SCALE**2) + lc
    lp += half_normal_logpdf(sigma, 1.0) + ls
    lp += jnp.sum(norm.logpdf(z, 0.0, 1.0))                       # NON-CENTERED: z ~ N(0,1)
    beta = z * _reg_local_scale(tau, lam, c2)                     # beta deterministic from z
    lp += jnp.sum(norm.logpdf(y_j, X_j @ beta, sigma))
    return lp
def hs_nc_beta(pos):   # reconstruct beta for diagnostics
    tau, lam, c2 = jnp.exp(pos["log_tau"]), jnp.exp(pos["log_lambda"]), jnp.exp(pos["log_c2"])
    return pos["beta_raw"] * _reg_local_scale(tau, lam, c2)
hs_nc_init = lambda key: {"beta_raw": 0.01*jax.random.normal(key,(P,)), "log_tau": jnp.array(-1.0),
    "log_lambda": jnp.zeros(P), "log_c2": jnp.array(0.0), "log_sigma": jnp.array(0.0)}

# ---- Model B: marginalized spike-and-slab (continuous mixture prior) ----
PI = K/P; SPIKE_SD, SLAB_SD = 0.05, 3.0
def spikeslab_logdensity(pos):
    beta = pos["beta"]; ls = pos["log_sigma"]; sigma = jnp.exp(ls)
    spike = jnp.log(1-PI) + norm.logpdf(beta, 0.0, SPIKE_SD)
    slab  = jnp.log(PI)   + norm.logpdf(beta, 0.0, SLAB_SD)
    lp  = jnp.sum(logsumexp(jnp.stack([spike, slab]), axis=0))   # marginalize inclusion
    lp += half_normal_logpdf(sigma, 1.0) + ls
    lp += jnp.sum(norm.logpdf(y_j, X_j @ beta, sigma))
    return lp
ss_init = lambda key: {"beta": 0.01*jax.random.normal(key,(P,)), "log_sigma": jnp.array(0.0)}

# ---- run NUTS + window adaptation, one chain ----
def run_chain(logdensity, beta_fn, init_pos, key):
    wkey, skey = jax.random.split(key)
    warmup = blackjax.window_adaptation(blackjax.nuts, logdensity, progress_bar=False)
    (state, params), _ = warmup.run(wkey, init_pos, num_steps=NUM_WARMUP)
    kernel = blackjax.nuts(logdensity, **params).step
    def one(carry, k):
        s, info = kernel(k, carry)
        return s, (beta_fn(s.position), info.is_divergent)
    keys = jax.random.split(skey, NUM_SAMPLES)
    _, (betas, divs) = jax.lax.scan(one, state, keys)
    return betas, divs

def run_model(name, logdensity, init_fn, beta_fn=lambda p: p["beta"]):
    key = jax.random.PRNGKey(SEED)
    keys = jax.random.split(key, NUM_CHAINS)
    inits = [init_fn(k) for k in keys]
    t0 = time.time()
    betas, divs = [], []
    runner = jax.jit(functools.partial(run_chain, logdensity, beta_fn))
    for k, ip in zip(keys, inits):
        bb, dv = runner(ip, k); bb.block_until_ready()
        betas.append(np.asarray(bb)); divs.append(np.asarray(dv))
    dt = time.time()-t0
    beta_s = np.stack(betas)                      # (chains, samples, P)
    ndiv = int(np.sum(divs))
    # ESS via blackjax diagnostics (chains x samples x P)
    ess = np.asarray(blackjax.diagnostics.effective_sample_size(beta_s))
    min_ess = float(np.min(ess))
    post_mean = beta_s.reshape(-1, P).mean(0)
    rmse = float(np.sqrt(np.mean((post_mean - beta_true)**2)))
    # selection: |posterior mean| threshold vs true nonzeros
    sel = np.abs(post_mean) > 0.5
    tp = int(np.sum(sel[:K])); fp = int(np.sum(sel[K:]))
    # calibration: 90% CI coverage of true beta
    lo = np.percentile(beta_s.reshape(-1,P), 5, 0); hi = np.percentile(beta_s.reshape(-1,P), 95, 0)
    cover = float(np.mean((beta_true >= lo) & (beta_true <= hi)))
    print(f"\n=== {name} ===")
    print(f"  time={dt:.1f}s | divergences={ndiv}/{NUM_SAMPLES*NUM_CHAINS} | min-ESS={min_ess:.0f} | ESS/sec={min_ess/dt:.1f}")
    print(f"  beta RMSE={rmse:.3f} | selection TP={tp}/{K} FP={fp}/{P-K} | 90%-CI coverage={cover:.2f}")
    return dict(name=name, time=dt, divergences=ndiv, min_ess=min_ess, ess_per_sec=min_ess/dt,
                rmse=rmse, tp=tp, fp=fp, coverage=cover)

print(f"sparse linear regression: N={N} P={P} K={K} (true nonzeros at idx 0..{K-1}={np.round(beta_true[:K],1)})", flush=True)
print(f"NUTS + window adaptation, {NUM_CHAINS} chains x {NUM_SAMPLES} samples ({NUM_WARMUP} warmup)", flush=True)
Ac = run_model("Horseshoe — CENTERED (naive)", horseshoe_c_logdensity, hs_c_init)
An = run_model("Horseshoe — NON-CENTERED (standard)", horseshoe_nc_logdensity, hs_nc_init, beta_fn=hs_nc_beta)
B  = run_model("Spike-and-slab (marginalized)", spikeslab_logdensity, ss_init)
def row(label, k, fmt):
    return f"  {label:<13}" + "".join(f"{m[k]:>{12}{fmt}}" for m in (Ac, An, B))
print("\n=== VERDICT (grades the folklore 'spike-slab is bad under HMC') ===")
print(f"  {'':<13}{'HS-centered':>12}{'HS-noncenter':>12}{'spike-slab':>12}")
print(row("divergences", "divergences", "d"))
print(row("min-ESS", "min_ess", ".0f"))
print(row("ESS/sec", "ess_per_sec", ".1f"))
print(row("RMSE", "rmse", ".3f"))
print(row("coverage", "coverage", ".2f"))
print(f"  selection TP/FP  HS-c {Ac['tp']}/{Ac['fp']}  HS-nc {An['tp']}/{An['fp']}  ss {B['tp']}/{B['fp']}")
