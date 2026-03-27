#!/usr/bin/env python3
"""
KISANSURAKSHA — CLIMATE HAZARD INTELLIGENCE DASHBOARD
Streamlit + Plotly  •  Power BI-style clean UI
Serves 4 personas: Farmers, PMFBY Insurance, NABARD Credit, Government/Policy
"""

import streamlit as st
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
import numpy as np
import os, sys

# ── ensure project root is on sys.path ──────────────────────────────────────
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from forecaster import ClimateHazardForecaster
from config import (
    MAHARASHTRA_DISTRICTS, DROUGHT_THRESHOLD, FLOOD_THRESHOLD,
    HEAT_WAVE_THRESHOLD,
)

# ═══════════════════════════════════════════════════════════════════════════════
# PAGE CONFIG
# ═══════════════════════════════════════════════════════════════════════════════
st.set_page_config(
    page_title="KisanSuraksha • Climate Intelligence",
    page_icon="🌾",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ═══════════════════════════════════════════════════════════════════════════════
# CUSTOM CSS — Power BI-style dark theme + soft animations
# ═══════════════════════════════════════════════════════════════════════════════
st.markdown("""
<style>
/* ── Import premium font ──────────────────────────────────────────────── */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* ── Root variables ───────────────────────────────────────────────────── */
:root {
    --bg-primary:   #0e1117;
    --bg-card:      #161b22;
    --bg-card-alt:  #1c2333;
    --border:       #30363d;
    --accent:       #58a6ff;
    --accent-glow:  rgba(88,166,255,.12);
    --green:        #3fb950;
    --amber:        #d29922;
    --red:          #f85149;
    --text-primary: #e6edf3;
    --text-muted:   #8b949e;
}

/* ── Global ───────────────────────────────────────────────────────────── */
html, body, [data-testid="stAppViewContainer"] {
    font-family: 'Inter', -apple-system, sans-serif !important;
}

/* ── Sidebar ──────────────────────────────────────────────────────────── */
[data-testid="stSidebar"] {
    background: linear-gradient(180deg, #0d1117 0%, #161b22 100%) !important;
    border-right: 1px solid var(--border);
}
[data-testid="stSidebar"] .stRadio > label {
    color: var(--text-primary) !important;
}

/* ── Metric cards (Power BI tile style) ─────────────────────────────── */
[data-testid="stMetric"] {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px 24px;
    transition: transform .25s ease, box-shadow .25s ease;
}
[data-testid="stMetric"]:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(0,0,0,.35);
}
[data-testid="stMetric"] label {
    color: var(--text-muted) !important;
    font-weight: 500;
    text-transform: uppercase;
    font-size: .72rem;
    letter-spacing: .6px;
}
[data-testid="stMetric"] [data-testid="stMetricValue"] {
    font-weight: 700;
    font-size: 1.7rem;
}

/* ── Cards / containers ───────────────────────────────────────────────── */
.glass-card {
    background: rgba(22,27,34,.82);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 28px 32px;
    margin-bottom: 20px;
    animation: fadeSlideUp .5s ease both;
}
.glass-card h3 {
    margin: 0 0 6px;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
}
.glass-card p.sub {
    margin: 0 0 18px;
    font-size: .82rem;
    color: var(--text-muted);
}

/* ── Status pill ──────────────────────────────────────────────────────── */
.pill {
    display: inline-block;
    padding: 6px 18px;
    border-radius: 999px;
    font-weight: 600;
    font-size: .85rem;
    letter-spacing: .3px;
    animation: fadeIn .6s ease both;
}
.pill-green  { background: rgba(63,185,80,.15); color: #3fb950; border: 1px solid rgba(63,185,80,.3); }
.pill-amber  { background: rgba(210,153,34,.15); color: #d29922; border: 1px solid rgba(210,153,34,.3); }
.pill-red    { background: rgba(248,81,73,.15); color: #f85149; border: 1px solid rgba(248,81,73,.3); }

/* ── Advisory box ─────────────────────────────────────────────────────── */
.advisory-box {
    background: rgba(88,166,255,.06);
    border-left: 4px solid var(--accent);
    border-radius: 0 10px 10px 0;
    padding: 16px 22px;
    margin-top: 14px;
    color: var(--text-primary);
    font-size: .88rem;
    line-height: 1.6;
    animation: fadeIn .7s ease both;
}

/* ── Animations ───────────────────────────────────────────────────────── */
@keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
}

/* stagger children */
.stColumns > div:nth-child(1) { animation: fadeSlideUp .45s ease both; }
.stColumns > div:nth-child(2) { animation: fadeSlideUp .55s ease both; }
.stColumns > div:nth-child(3) { animation: fadeSlideUp .65s ease both; }
.stColumns > div:nth-child(4) { animation: fadeSlideUp .75s ease both; }

/* ── Plotly chart wrapper ─────────────────────────────────────────────── */
.stPlotlyChart {
    border-radius: 12px;
    overflow: hidden;
    animation: fadeSlideUp .6s ease both;
}

/* ── Tabs override ────────────────────────────────────────────────────── */
.stTabs [data-baseweb="tab-list"] {
    gap: 6px;
    background: var(--bg-card);
    border-radius: 12px;
    padding: 6px;
    border: 1px solid var(--border);
}
.stTabs [data-baseweb="tab"] {
    border-radius: 8px;
    padding: 10px 22px;
    font-weight: 500;
    transition: background .25s ease;
}
.stTabs [aria-selected="true"] {
    background: var(--accent-glow) !important;
    color: var(--accent) !important;
}

/* ── SelectBox ────────────────────────────────────────────────────────── */
[data-testid="stSelectbox"] > div > div {
    border-radius: 10px !important;
}

/* ── hide Streamlit branding ──────────────────────────────────────────── */
#MainMenu, footer, header {visibility: hidden;}
</style>
""", unsafe_allow_html=True)

# ═══════════════════════════════════════════════════════════════════════════════
# DATA LOADING (cached)
# ═══════════════════════════════════════════════════════════════════════════════

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "maharashtra_climate_data.csv")

@st.cache_data(show_spinner="Loading climate data …")
def load_data():
    if os.path.exists(DATA_PATH):
        return pd.read_csv(DATA_PATH)
    return None

@st.cache_resource(show_spinner="Loading ML models …")
def load_forecaster():
    f = ClimateHazardForecaster()
    f.load_model()
    return f

data_df = load_data()
forecaster = load_forecaster()

# ── helper: get predictions for a district ──────────────────────────────
def predict_for_district(district: str):
    if data_df is None or not forecaster.models:
        return None
    dd = data_df[data_df["district"] == district]
    if dd.empty:
        return None
    feat = forecaster.prepare_features(dd)
    cols = [c for c in feat.columns if c not in ("district", "date")]
    if not cols:
        return None
    X = feat[cols].iloc[-1:].values
    preds = forecaster.predict_hazards(X)
    return {
        "drought": float(preds["drought"]["risk_score"][0]),
        "flood":   float(preds["flood"]["risk_score"][0]),
        "heat":    float(preds["heat_wave"]["risk_score"][0]),
    }

# ── helper: risk colour ─────────────────────────────────────────────────
def risk_color(score):
    if score > 0.7:  return "#f85149"
    if score > 0.4:  return "#d29922"
    return "#3fb950"

def risk_label(score):
    if score > 0.7:  return "HIGH"
    if score > 0.4:  return "MODERATE"
    return "LOW"

# ── helper: plotly dark template ─────────────────────────────────────────
PLOTLY_LAYOUT = dict(
    paper_bgcolor="rgba(0,0,0,0)",
    plot_bgcolor="rgba(0,0,0,0)",
    font=dict(family="Inter, sans-serif", color="#e6edf3"),
    margin=dict(l=40, r=30, t=50, b=40),
    hoverlabel=dict(bgcolor="#1c2333", font_color="#e6edf3", bordercolor="#30363d"),
)

# ── helper: gauge chart ──────────────────────────────────────────────────
def make_gauge(value, title, color):
    fig = go.Figure(go.Indicator(
        mode="gauge+number",
        value=value * 100,
        number=dict(suffix="%", font=dict(size=38, color=color)),
        title=dict(text=title, font=dict(size=14, color="#8b949e")),
        gauge=dict(
            axis=dict(range=[0, 100], tickcolor="#30363d", dtick=25),
            bar=dict(color=color, thickness=0.7),
            bgcolor="#1c2333",
            borderwidth=0,
            steps=[
                dict(range=[0, 40],  color="rgba(63,185,80,.08)"),
                dict(range=[40, 70], color="rgba(210,153,34,.08)"),
                dict(range=[70, 100],color="rgba(248,81,73,.08)"),
            ],
            threshold=dict(line=dict(color="#e6edf3", width=2), thickness=0.8, value=70),
        ),
    ))
    fig.update_layout(**PLOTLY_LAYOUT, height=240)
    return fig

# ═══════════════════════════════════════════════════════════════════════════════
# SIDEBAR
# ═══════════════════════════════════════════════════════════════════════════════
with st.sidebar:
    st.markdown("""
    <div style="text-align:center; padding:18px 0 10px;">
        <span style="font-size:2.6rem;">🌾</span>
        <h2 style="margin:6px 0 2px; font-weight:700; letter-spacing:-.5px;
                    background:linear-gradient(135deg,#58a6ff,#3fb950);
                    -webkit-background-clip:text; -webkit-text-fill-color:transparent;">
            KisanSuraksha
        </h2>
        <p style="color:#8b949e; font-size:.78rem; margin:0;">
            Climate Hazard Intelligence Platform
        </p>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("---")

    page = st.radio(
        "Navigate",
        [
            "🌾  Farmer Advisory",
            "📋  PMFBY Insurance",
            "💳  NABARD Credit Risk",
            "📊  Analytics Overview",
            "⏳  Long-Term Horizon",
        ],
        label_visibility="collapsed",
    )

    st.markdown("---")
    st.caption("**Target Users**")
    st.markdown("""
    <div style="font-size:.78rem; color:#8b949e; line-height:1.8;">
    👨‍🌾 &nbsp;Farmers & FPOs<br>
    🏛️ &nbsp;PMFBY Insurance Officers<br>
    🏦 &nbsp;NABARD / Bank Officers<br>
    📜 &nbsp;Government & Policy Makers
    </div>
    """, unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)
    st.caption(f"Districts: **{len(MAHARASHTRA_DISTRICTS)}**  •  Hazards: **3**")

# ═══════════════════════════════════════════════════════════════════════════════
# HELPER: district selector for forecasting tabs
# ═══════════════════════════════════════════════════════════════════════════════
def district_selector(key: str):
    districts_in_data = sorted(data_df["district"].unique()) if data_df is not None else MAHARASHTRA_DISTRICTS
    return st.selectbox("Select District", districts_in_data, key=key)


# ═══════════════════════════════════════════════════════════════════════════════
# TAB 1 — FARMER ADVISORY  🌾
# ═══════════════════════════════════════════════════════════════════════════════
if page.startswith("🌾"):
    st.markdown("""
    <div class="glass-card">
        <h3>🌾 Farmer Crop Advisory</h3>
        <p class="sub">Real-time climate hazard risk assessment with actionable farming recommendations.</p>
    </div>
    """, unsafe_allow_html=True)

    district = district_selector("farmer_district")

    if st.button("🔍  Analyse Risk", key="farmer_btn", use_container_width=True):
        with st.spinner("Running hazard models …"):
            scores = predict_for_district(district)

        if scores is None:
            st.error("Could not generate predictions. Ensure data & models are available.")
        else:
            # ── KPI row ──────────────────────────────────────────────────
            c1, c2, c3 = st.columns(3)
            c1.metric("Drought Risk",  f"{scores['drought']*100:.1f}%")
            c2.metric("Flood Risk",    f"{scores['flood']*100:.1f}%")
            c3.metric("Heat-Wave Risk",f"{scores['heat']*100:.1f}%")

            # ── Gauge row ────────────────────────────────────────────────
            g1, g2, g3 = st.columns(3)
            g1.plotly_chart(make_gauge(scores["drought"], "Drought", risk_color(scores["drought"])), use_container_width=True)
            g2.plotly_chart(make_gauge(scores["flood"],   "Flood",   risk_color(scores["flood"])),   use_container_width=True)
            g3.plotly_chart(make_gauge(scores["heat"],    "Heat Wave",risk_color(scores["heat"])),   use_container_width=True)

            # ── Advisory ─────────────────────────────────────────────────
            tips = []
            if scores["drought"] > DROUGHT_THRESHOLD:
                tips.append("🚨 **Drought Alert** — Switch to drought-resistant varieties. Use drip irrigation & mulching. Ensure on-farm water storage.")
            if scores["flood"] > FLOOD_THRESHOLD:
                tips.append("🌊 **Flood Alert** — Clear drainage channels. Avoid low-lying sowing. Prepare seed re-sowing plan.")
            if scores["heat"] > HEAT_WAVE_THRESHOLD:
                tips.append("🔥 **Heat-Wave Alert** — Deploy shade nets. Increase watering frequency. Schedule field work before 10 AM.")
            if not tips:
                tips.append("✅ **Conditions Favourable** — Standard crop management practices recommended. Monitor weekly.")

            st.markdown('<div class="advisory-box">' + "<br>".join(tips) + "</div>", unsafe_allow_html=True)


# ═══════════════════════════════════════════════════════════════════════════════
# TAB 2 — PMFBY INSURANCE  📋
# ═══════════════════════════════════════════════════════════════════════════════
elif page.startswith("📋"):
    st.markdown("""
    <div class="glass-card">
        <h3>📋 PMFBY Insurance Trigger Engine</h3>
        <p class="sub">Automatic crop-insurance activation when drought or flood risk exceeds PMFBY thresholds.</p>
    </div>
    """, unsafe_allow_html=True)

    district = district_selector("ins_district")

    if st.button("⚡  Check Trigger Status", key="ins_btn", use_container_width=True):
        with st.spinner("Evaluating thresholds …"):
            scores = predict_for_district(district)

        if scores is None:
            st.error("Prediction unavailable.")
        else:
            trigger = scores["drought"] > DROUGHT_THRESHOLD or scores["flood"] > FLOOD_THRESHOLD

            # ── Status pill ──────────────────────────────────────────────
            if trigger:
                st.markdown(f'<div style="text-align:center;margin:18px 0;"><span class="pill pill-red">⚠️  INSURANCE TRIGGERED — {district}</span></div>', unsafe_allow_html=True)
            else:
                st.markdown(f'<div style="text-align:center;margin:18px 0;"><span class="pill pill-green">✅  No Trigger Required — {district}</span></div>', unsafe_allow_html=True)

            # ── KPI ──────────────────────────────────────────────────────
            k1, k2, k3 = st.columns(3)
            k1.metric("Drought Risk", f"{scores['drought']*100:.1f}%")
            k2.metric("Flood Risk",   f"{scores['flood']*100:.1f}%")
            k3.metric("Threshold",    f"D>{DROUGHT_THRESHOLD*100:.0f}% / F>{FLOOD_THRESHOLD*100:.0f}%")

            # ── Horizontal bar ───────────────────────────────────────────
            fig = go.Figure()
            for name, val, thresh in [
                ("Drought", scores["drought"], DROUGHT_THRESHOLD),
                ("Flood",   scores["flood"],   FLOOD_THRESHOLD),
            ]:
                fig.add_trace(go.Bar(
                    y=[name], x=[val*100], orientation="h",
                    marker_color=risk_color(val),
                    text=f"{val*100:.1f}%", textposition="inside",
                    textfont=dict(color="white", size=14),
                    name=name,
                ))
                # threshold line
                fig.add_shape(type="line", y0=name, y1=name,
                              x0=thresh*100, x1=thresh*100,
                              line=dict(color="#e6edf3", width=2, dash="dash"))
            fig.update_layout(**PLOTLY_LAYOUT, height=200, showlegend=False,
                              xaxis=dict(range=[0,100], title="Risk %", gridcolor="#21262d"),
                              yaxis=dict(gridcolor="#21262d"),
                              title="Risk vs Threshold")
            st.plotly_chart(fig, use_container_width=True)

            # ── Advisory ─────────────────────────────────────────────────
            if trigger:
                st.markdown(f"""<div class="advisory-box">
                <b>Action required:</b> PMFBY insurance payout process should be initiated for <b>{district}</b>.
                Drought risk ({scores['drought']*100:.1f}%) or Flood risk ({scores['flood']*100:.1f}%) exceeds the prescribed threshold.
                Notify the district agriculture officer and insurance partner.
                </div>""", unsafe_allow_html=True)
            else:
                st.markdown(f"""<div class="advisory-box">
                All risk levels are within acceptable limits for <b>{district}</b>. No insurance trigger at this time. Next review recommended in 15 days.
                </div>""", unsafe_allow_html=True)


# ═══════════════════════════════════════════════════════════════════════════════
# TAB 3 — NABARD CREDIT RISK  💳
# ═══════════════════════════════════════════════════════════════════════════════
elif page.startswith("💳"):
    st.markdown("""
    <div class="glass-card">
        <h3>💳 NABARD Credit Risk Assessment</h3>
        <p class="sub">Kisan Credit Card risk flagging based on climate hazard exposure for lending decisions.</p>
    </div>
    """, unsafe_allow_html=True)

    district = district_selector("credit_district")

    if st.button("🏦  Assess Credit Risk", key="credit_btn", use_container_width=True):
        with st.spinner("Running credit risk model …"):
            scores = predict_for_district(district)

        if scores is None:
            st.error("Prediction unavailable.")
        else:
            max_risk = max(scores.values())
            level = "HIGH" if max_risk > 0.7 else "MEDIUM" if max_risk > 0.5 else "LOW"
            pill_cls = {"HIGH": "pill-red", "MEDIUM": "pill-amber", "LOW": "pill-green"}[level]

            # ── Status ───────────────────────────────────────────────────
            st.markdown(f'<div style="text-align:center;margin:18px 0;"><span class="pill {pill_cls}">Credit Risk Level: {level}</span></div>', unsafe_allow_html=True)

            # ── KPI ──────────────────────────────────────────────────────
            k1, k2 = st.columns(2)
            k1.metric("Max Hazard Score", f"{max_risk*100:.1f}%")
            k2.metric("Risk Classification", level)

            # ── Gauge ────────────────────────────────────────────────────
            st.plotly_chart(make_gauge(max_risk, f"Credit Risk — {district}", risk_color(max_risk)), use_container_width=True)

            # ── Breakdown bar ────────────────────────────────────────────
            fig = go.Figure(go.Bar(
                x=["Drought", "Flood", "Heat Wave"],
                y=[scores["drought"]*100, scores["flood"]*100, scores["heat"]*100],
                marker_color=[risk_color(scores["drought"]), risk_color(scores["flood"]), risk_color(scores["heat"])],
                text=[f"{v*100:.1f}%" for v in [scores["drought"], scores["flood"], scores["heat"]]],
                textposition="outside", textfont=dict(color="#e6edf3"),
            ))
            fig.update_layout(**PLOTLY_LAYOUT, height=300, showlegend=False,
                              yaxis=dict(range=[0,100], title="Risk %", gridcolor="#21262d"),
                              xaxis=dict(gridcolor="#21262d"),
                              title="Hazard Breakdown")
            st.plotly_chart(fig, use_container_width=True)

            # ── Advice ───────────────────────────────────────────────────
            advice_map = {
                "HIGH": f"⚠️ **High Risk** — Recommend reduced credit limit or additional collateral for borrowers in **{district}**. Increase monitoring frequency.",
                "MEDIUM": f"⚠️ **Moderate Risk** — Standard lending with enhanced monitoring for **{district}**. Review in next quarter.",
                "LOW": f"✅ **Low Risk** — Favourable conditions for credit approval in **{district}**. Normal KCC lending parameters apply.",
            }
            st.markdown(f'<div class="advisory-box">{advice_map[level]}</div>', unsafe_allow_html=True)


# ═══════════════════════════════════════════════════════════════════════════════
# TAB 4 — ANALYTICS OVERVIEW  📊
# ═══════════════════════════════════════════════════════════════════════════════
elif page.startswith("📊"):
    st.markdown("""
    <div class="glass-card">
        <h3>📊 State-Wide Analytics Dashboard</h3>
        <p class="sub">Comprehensive climate parameter overview for Government & Policy stakeholders across all Maharashtra districts.</p>
    </div>
    """, unsafe_allow_html=True)

    if data_df is None:
        st.warning("Climate data not loaded.")
    else:
        # ── Top KPI row ──────────────────────────────────────────────────
        k1, k2, k3, k4 = st.columns(4)
        k1.metric("Districts Covered",  data_df["district"].nunique())
        k2.metric("Climate Parameters", data_df["parameter"].nunique())
        k3.metric("Total Records",      f"{len(data_df):,}")
        k4.metric("Hazards Monitored",  "3")

        # ── Heatmap: district × parameter ────────────────────────────────
        pivot = data_df.pivot_table(index="district", columns="parameter", values="value", aggfunc="mean")
        fig_heat = px.imshow(
            pivot, text_auto=".2f",
            color_continuous_scale="Tealgrn",
            labels=dict(color="Mean Value"),
            aspect="auto",
        )
        fig_heat.update_layout(**PLOTLY_LAYOUT, height=600,
                                title="Climate Parameters by District (Mean)")
        st.plotly_chart(fig_heat, use_container_width=True)

        # ── Hazard scores bar chart ──────────────────────────────────────
        if forecaster.models:
            st.markdown("#### Hazard Risk Scores Across Districts")
            districts_list = sorted(data_df["district"].unique())
            rows = []
            for d in districts_list:
                s = predict_for_district(d)
                if s:
                    rows.append({"District": d, "Drought": s["drought"]*100,
                                 "Flood": s["flood"]*100, "Heat Wave": s["heat"]*100})
            if rows:
                risk_df = pd.DataFrame(rows).set_index("District")
                fig_bar = go.Figure()
                colors = {"Drought": "#f85149", "Flood": "#58a6ff", "Heat Wave": "#d29922"}
                for col in ["Drought", "Flood", "Heat Wave"]:
                    fig_bar.add_trace(go.Bar(
                        x=risk_df.index, y=risk_df[col],
                        name=col, marker_color=colors[col],
                    ))
                fig_bar.update_layout(**PLOTLY_LAYOUT, barmode="group", height=420,
                                      yaxis=dict(title="Risk %", range=[0,100], gridcolor="#21262d"),
                                      xaxis=dict(tickangle=-45, gridcolor="#21262d"),
                                      legend=dict(orientation="h", y=1.12),
                                      title="District-Level Hazard Comparison")
                fig_bar.add_hline(y=70, line_dash="dash", line_color="#e6edf3",
                                  annotation_text="High-Risk Threshold", annotation_font_color="#8b949e")
                st.plotly_chart(fig_bar, use_container_width=True)

        # ── Distribution histograms ──────────────────────────────────────
        st.markdown("#### Parameter Distributions")
        params = data_df["parameter"].unique()
        cols = st.columns(min(len(params), 4))
        palette = {"soil_moisture_index": "#3fb950", "ndvi": "#58a6ff",
                   "rainfall": "#539bf5", "temperature": "#d29922"}
        for i, p in enumerate(params):
            with cols[i % len(cols)]:
                vals = data_df[data_df["parameter"] == p]["value"]
                fig_h = px.histogram(vals, nbins=60, color_discrete_sequence=[palette.get(p, "#58a6ff")])
                fig_h.update_layout(**PLOTLY_LAYOUT, height=250, showlegend=False,
                                    title=p.replace("_", " ").title(),
                                    xaxis_title="Value", yaxis_title="Count",
                                    xaxis=dict(gridcolor="#21262d"),
                                    yaxis=dict(gridcolor="#21262d"))
                st.plotly_chart(fig_h, use_container_width=True)

        # ── System info ──────────────────────────────────────────────────
        st.markdown("---")
        st.markdown("""
        <div style="text-align:center; color:#8b949e; font-size:.8rem; padding:10px 0;">
            Data Source: <b>DiCRA API</b> &nbsp;•&nbsp; Model: <b>Random Forest Classifier</b> &nbsp;•&nbsp;
            Validation: <b>2012, 2015, 2016, 2018</b> drought years
        </div>
        """, unsafe_allow_html=True)


# ═══════════════════════════════════════════════════════════════════════════════
# TAB 5 — LONG-TERM HORIZON  ⏳
# ═══════════════════════════════════════════════════════════════════════════════
elif page.startswith("⏳"):
    st.markdown("""
    <div class="glass-card">
        <h3>⏳ 10–15 Year Hazard Horizon Forecast</h3>
        <p class="sub">Long-range climate risk projection using historical trend extrapolation — for strategic planning.</p>
    </div>
    """, unsafe_allow_html=True)

    col_a, col_b = st.columns([2, 1])
    with col_a:
        district = district_selector("horizon_district")
    with col_b:
        horizon_years = st.slider("Projection Years", 5, 20, 15, key="horizon_years")

    if st.button("📈  Generate Forecast", key="horizon_btn", use_container_width=True):
        with st.spinner("Projecting climate trends …"):
            if data_df is None:
                st.error("Historical data not available.")
            else:
                df = data_df[data_df["district"] == district].copy()
                if df.empty:
                    st.error(f"No data for {district}.")
                else:
                    df["date"] = pd.to_datetime(df["date"])
                    df = df.sort_values("date")

                    def baseline(param):
                        sub = df[df["parameter"] == param]
                        if sub.empty:
                            return None
                        return sub.groupby(sub["date"].dt.year)["value"].mean()

                    drought_s = baseline("soil_moisture_index")
                    flood_s   = baseline("rainfall")
                    heat_s    = baseline("temperature")

                    if drought_s is None or flood_s is None or heat_s is None:
                        st.error("Insufficient parameter data for projection.")
                    else:
                        years = np.array(drought_s.index)
                        future = np.arange(years[-1] + 1, years[-1] + 1 + horizon_years)

                        def project(series):
                            x, y = years, series.values
                            if len(x) < 2:
                                return np.full(horizon_years, y[-1] if len(y) else 0)
                            m, b = np.polyfit(x, y, 1)
                            return m * future + b

                        drought_risk = np.clip((0.7 - project(drought_s)) / 0.4, 0, 1)
                        flood_risk   = np.clip((project(flood_s) - 3.5) / 4.5, 0, 1)
                        heat_risk    = np.clip((project(heat_s) - 30) / 10, 0, 1)

                        # ── Line chart ───────────────────────────────────
                        fig = go.Figure()
                        fig.add_trace(go.Scatter(
                            x=future, y=drought_risk, name="Drought",
                            line=dict(color="#f85149", width=3),
                            fill="tozeroy", fillcolor="rgba(248,81,73,.08)",
                        ))
                        fig.add_trace(go.Scatter(
                            x=future, y=flood_risk, name="Flood",
                            line=dict(color="#58a6ff", width=3),
                            fill="tozeroy", fillcolor="rgba(88,166,255,.08)",
                        ))
                        fig.add_trace(go.Scatter(
                            x=future, y=heat_risk, name="Heat Wave",
                            line=dict(color="#d29922", width=3),
                            fill="tozeroy", fillcolor="rgba(210,153,34,.08)",
                        ))
                        fig.add_hline(y=0.7, line_dash="dash", line_color="#e6edf3",
                                      annotation_text="High-Risk Threshold",
                                      annotation_font_color="#8b949e")
                        fig.update_layout(
                            **PLOTLY_LAYOUT, height=440,
                            title=f"Projected Hazard Risk — {district} ({future[0]}–{future[-1]})",
                            xaxis=dict(title="Year", gridcolor="#21262d"),
                            yaxis=dict(title="Risk Score", range=[0, 1], gridcolor="#21262d"),
                            legend=dict(orientation="h", y=1.12),
                        )
                        st.plotly_chart(fig, use_container_width=True)

                        # ── Summary metrics ──────────────────────────────
                        m1, m2, m3 = st.columns(3)
                        m1.metric("Drought Risk (End)", f"{drought_risk[-1]*100:.1f}%",
                                  delta=f"{(drought_risk[-1]-drought_risk[0])*100:+.1f}%")
                        m2.metric("Flood Risk (End)",   f"{flood_risk[-1]*100:.1f}%",
                                  delta=f"{(flood_risk[-1]-flood_risk[0])*100:+.1f}%")
                        m3.metric("Heat Risk (End)",    f"{heat_risk[-1]*100:.1f}%",
                                  delta=f"{(heat_risk[-1]-heat_risk[0])*100:+.1f}%")

                        st.markdown(f"""<div class="advisory-box">
                        <b>Strategic Insight for {district}:</b> Over the next {horizon_years} years,
                        drought risk is projected at <b>{drought_risk[-1]*100:.1f}%</b>,
                        flood risk at <b>{flood_risk[-1]*100:.1f}%</b>, and
                        heat-wave risk at <b>{heat_risk[-1]*100:.1f}%</b>.
                        Use this data for long-term infrastructure, crop-planning, and insurance portfolio strategy.
                        </div>""", unsafe_allow_html=True)
