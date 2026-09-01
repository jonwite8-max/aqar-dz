# Observability

يُعتمد لاحقًا مزود Metrics/Logs/Tracing قابل للاستبدال. الحد الأدنى عند التفعيل:
- Correlation ID end-to-end.
- Structured logs مع PII redaction.
- p95 latency للبحث والنشر والـAPI.
- error rate وqueue lag وnotification delivery.
- dashboards + actionable alerts.
- Runbooks تحت `observability/runbooks/`.

لا يضاف Vendor SDK مباشرة داخل Domain Modules.
