export type Lang = "en" | "es" | "ar";

export type NavKey = "home" | "about" | "services" | "industries" | "logistics" | "contact";

export type TranslationKey =
  | "meta.tagline"
  | "meta.company"
  | "nav.home"
  | "nav.about"
  | "nav.services"
  | "nav.industries"
  | "nav.logistics"
  | "nav.contact"
  | "cta.primary"
  | "cta.secondary"
  | "home.hero.title"
  | "home.hero.subtitle"
  | "home.hero.points.1"
  | "home.hero.points.2"
  | "home.hero.points.3"
  | "home.stats.1.title"
  | "home.stats.1.desc"
  | "home.stats.2.title"
  | "home.stats.2.desc"
  | "home.stats.3.title"
  | "home.stats.3.desc"
  | "home.services.import.title"
  | "home.services.import.desc"
  | "home.services.export.title"
  | "home.services.export.desc"
  | "home.services.trade.title"
  | "home.services.trade.desc"
  | "about.title"
  | "about.lede"
  | "about.blocks.1.title"
  | "about.blocks.1.desc"
  | "about.blocks.2.title"
  | "about.blocks.2.desc"
  | "about.blocks.3.title"
  | "about.blocks.3.desc"
  | "services.title"
  | "services.lede"
  | "services.import.title"
  | "services.import.items.1"
  | "services.import.items.2"
  | "services.import.items.3"
  | "services.export.title"
  | "services.export.items.1"
  | "services.export.items.2"
  | "services.export.items.3"
  | "services.support.title"
  | "services.support.items.1"
  | "services.support.items.2"
  | "services.support.items.3"
  | "industries.title"
  | "industries.lede"
  | "industries.auto.title"
  | "industries.auto.desc"
  | "industries.fire.title"
  | "industries.fire.desc"
  | "industries.agri.title"
  | "industries.agri.desc"
  | "logistics.title"
  | "logistics.lede"
  | "logistics.blocks.1.title"
  | "logistics.blocks.1.desc"
  | "logistics.blocks.2.title"
  | "logistics.blocks.2.desc"
  | "logistics.blocks.3.title"
  | "logistics.blocks.3.desc"
  | "contact.title"
  | "contact.lede"
  | "contact.form.name"
  | "contact.form.email"
  | "contact.form.phone"
  | "contact.form.topic"
  | "contact.form.message"
  | "contact.form.send"
  | "contact.note"
  | "footer.note";

export const translations: Record<Lang, Record<TranslationKey, string>> = {
  en: {
    "meta.company": "Met71 Spain",
    "meta.tagline": "Trade between Europe and North Africa — made practical.",

    "nav.home": "Home",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.industries": "Industries",
    "nav.logistics": "Logistics",
    "nav.contact": "Contact",

    "cta.primary": "Request a quote",
    "cta.secondary": "Explore services",

    "home.hero.title": "Spain–Egypt trade, handled end‑to‑end.",
    "home.hero.subtitle":
      "Met71 Spain supports import and export operations with documentation, market intelligence, and logistics coordination — built for speed and compliance.",
    "home.hero.points.1": "Import: premium European vehicles + firefighting equipment",
    "home.hero.points.2": "Export: agricultural products & fertilizers with cold-chain support",
    "home.hero.points.3": "Customs, regulations, and logistics — one coordinated process",

    "home.stats.1.title": "Spain + Egypt",
    "home.stats.1.desc": "Operations rooted in Spain with strategic presence in Egypt.",
    "home.stats.2.title": "Temperature‑controlled",
    "home.stats.2.desc": "Cold‑chain capable handling for sensitive agri exports.",
    "home.stats.3.title": "Cross‑sector",
    "home.stats.3.desc": "Automotive, fire safety, and agriculture — under one roof.",

    "home.services.import.title": "Import",
    "home.services.import.desc":
      "Premium European vehicle brands, critical firefighting equipment, and spare parts — sourced and cleared with precision.",
    "home.services.export.title": "Export",
    "home.services.export.desc":
      "High‑quality agricultural products and fertilizers, supported by temperature‑controlled logistics when needed.",
    "home.services.trade.title": "Trade Services",
    "home.services.trade.desc":
      "Customs documentation, market analysis, and logistics management to streamline international trade.",

    "about.title": "Built for complex trade.",
    "about.lede":
      "Met71 Spain is an international import & export company with its main operations in Spain and a strategic presence in Egypt, facilitating trade between Europe and North Africa.",
    "about.blocks.1.title": "Regulations, without the drama",
    "about.blocks.1.desc":
      "We navigate multi‑jurisdiction requirements, documentation, and customs procedures with a compliance‑first mindset.",
    "about.blocks.2.title": "Market‑aware execution",
    "about.blocks.2.desc":
      "We combine market analysis with operational planning so decisions travel well across borders.",
    "about.blocks.3.title": "Operational coordination",
    "about.blocks.3.desc":
      "From suppliers to freight partners, we keep stakeholders aligned to reduce delays and surprises.",

    "services.title": "Services",
    "services.lede": "Clear scopes. Measurable steps. Fewer bottlenecks.",

    "services.import.title": "Import (Europe → North Africa)",
    "services.import.items.1": "Premium European vehicle brands (sourcing + transport coordination)",
    "services.import.items.2": "Firefighting equipment and critical spare parts",
    "services.import.items.3": "Customs documentation and clearance support",

    "services.export.title": "Export (North Africa → Europe)",
    "services.export.items.1": "High‑quality agricultural products",
    "services.export.items.2": "Fertilizers and related agri inputs",
    "services.export.items.3": "Temperature‑controlled logistics for sensitive shipments",

    "services.support.title": "Trade Enablement",
    "services.support.items.1": "Customs paperwork and regulatory coordination",
    "services.support.items.2": "Market analysis and partner sourcing support",
    "services.support.items.3": "End‑to‑end logistics management",

    "industries.title": "Industries",
    "industries.lede": "Specialized execution across sectors with very different risk profiles.",
    "industries.auto.title": "Automotive",
    "industries.auto.desc": "Premium vehicle imports with careful handling and documentation.",
    "industries.fire.title": "Fire Safety",
    "industries.fire.desc": "Importing critical firefighting equipment and spares, where timing matters.",
    "industries.agri.title": "Agriculture",
    "industries.agri.desc":
      "Exporting agricultural products and fertilizers, supported by cold‑chain logistics when required.",

    "logistics.title": "Logistics & Handling",
    "logistics.lede": "When trade is complex, logistics must be simple — but not simplistic.",
    "logistics.blocks.1.title": "Cold‑chain ready",
    "logistics.blocks.1.desc":
      "Temperature‑controlled handling to protect product quality from origin to destination.",
    "logistics.blocks.2.title": "Documentation as a workflow",
    "logistics.blocks.2.desc":
      "We treat paperwork like operations: tracked, reviewed, and aligned with shipment milestones.",
    "logistics.blocks.3.title": "Partners you can measure",
    "logistics.blocks.3.desc":
      "We coordinate with freight and last‑mile partners to reduce handoff risk and improve predictability.",

    "contact.title": "Contact",
    "contact.lede": "Tell us what you’re moving, and where it needs to go.",
    "contact.form.name": "Name",
    "contact.form.email": "Email",
    "contact.form.phone": "Phone (optional)",
    "contact.form.topic": "Topic",
    "contact.form.message": "Message",
    "contact.form.send": "Send message",
    "contact.note": "This form is a demo (no backend). We’ll provide wiring on request.",

    "footer.note": "© Met71 Spain. International trade coordination between Europe and North Africa.",
  },

  es: {
    "meta.company": "Met71 Spain",
    "meta.tagline": "Comercio entre Europa y el Norte de África — sin fricciones.",

    "nav.home": "Inicio",
    "nav.about": "Quiénes somos",
    "nav.services": "Servicios",
    "nav.industries": "Sectores",
    "nav.logistics": "Logística",
    "nav.contact": "Contacto",

    "cta.primary": "Solicitar presupuesto",
    "cta.secondary": "Ver servicios",

    "home.hero.title": "Comercio España–Egipto, de principio a fin.",
    "home.hero.subtitle":
      "Met71 Spain apoya operaciones de importación y exportación con documentación, análisis de mercado y gestión logística — orientado a rapidez y cumplimiento.",
    "home.hero.points.1": "Importación: vehículos europeos premium + equipos contra incendios",
    "home.hero.points.2": "Exportación: productos agrícolas y fertilizantes con apoyo de cadena de frío",
    "home.hero.points.3": "Aduanas, normativa y logística — un proceso coordinado",

    "home.stats.1.title": "España + Egipto",
    "home.stats.1.desc": "Operación principal en España y presencia estratégica en Egipto.",
    "home.stats.2.title": "Temperatura controlada",
    "home.stats.2.desc": "Gestión con cadena de frío para exportaciones sensibles.",
    "home.stats.3.title": "Multisectorial",
    "home.stats.3.desc": "Automoción, seguridad contra incendios y agricultura.",

    "home.services.import.title": "Importación",
    "home.services.import.desc":
      "Marcas europeas de vehículos premium, equipos contra incendios y repuestos — con abastecimiento y despacho cuidadosos.",
    "home.services.export.title": "Exportación",
    "home.services.export.desc":
      "Productos agrícolas de alta calidad y fertilizantes, con logística a temperatura controlada cuando se requiere.",
    "home.services.trade.title": "Servicios de comercio",
    "home.services.trade.desc":
      "Documentación aduanera, análisis de mercado y gestión logística para simplificar el comercio internacional.",

    "about.title": "Diseñados para comercio complejo.",
    "about.lede":
      "Met71 Spain es una empresa internacional de importación y exportación, con operación principal en España y presencia estratégica en Egipto, facilitando el comercio entre Europa y el Norte de África.",
    "about.blocks.1.title": "Normativa, bien gestionada",
    "about.blocks.1.desc":
      "Navegamos requisitos multi‑jurisdicción, documentación y aduanas con un enfoque de cumplimiento.",
    "about.blocks.2.title": "Ejecución con visión de mercado",
    "about.blocks.2.desc":
      "Combinamos análisis de mercado con planificación operativa para decisiones sólidas.",
    "about.blocks.3.title": "Coordinación operativa",
    "about.blocks.3.desc":
      "Alineamos proveedores y socios logísticos para reducir retrasos e imprevistos.",

    "services.title": "Servicios",
    "services.lede": "Alcances claros. Pasos medibles. Menos cuellos de botella.",

    "services.import.title": "Importación (Europa → Norte de África)",
    "services.import.items.1": "Marcas europeas premium (origen + coordinación de transporte)",
    "services.import.items.2": "Equipos contra incendios y repuestos críticos",
    "services.import.items.3": "Soporte en documentación y despacho aduanero",

    "services.export.title": "Exportación (Norte de África → Europa)",
    "services.export.items.1": "Productos agrícolas de alta calidad",
    "services.export.items.2": "Fertilizantes e insumos agrícolas",
    "services.export.items.3": "Logística a temperatura controlada para cargas sensibles",

    "services.support.title": "Soporte al comercio",
    "services.support.items.1": "Gestión documental y coordinación regulatoria",
    "services.support.items.2": "Análisis de mercado y apoyo en búsqueda de socios",
    "services.support.items.3": "Gestión logística de extremo a extremo",

    "industries.title": "Sectores",
    "industries.lede": "Ejecución especializada en sectores con perfiles de riesgo distintos.",
    "industries.auto.title": "Automoción",
    "industries.auto.desc": "Importación de vehículos premium con cuidado y documentación precisa.",
    "industries.fire.title": "Seguridad contra incendios",
    "industries.fire.desc": "Importación de equipos críticos y repuestos, donde el tiempo importa.",
    "industries.agri.title": "Agricultura",
    "industries.agri.desc":
      "Exportación de productos agrícolas y fertilizantes, con soporte de cadena de frío cuando procede.",

    "logistics.title": "Logística y manipulación",
    "logistics.lede": "Cuando el comercio es complejo, la logística debe ser simple — sin ser simplista.",
    "logistics.blocks.1.title": "Cadena de frío",
    "logistics.blocks.1.desc":
      "Gestión a temperatura controlada para proteger la calidad del producto de origen a destino.",
    "logistics.blocks.2.title": "Documentación como proceso",
    "logistics.blocks.2.desc":
      "Tratamos el papeleo como operaciones: seguimiento, revisión y hitos vinculados al envío.",
    "logistics.blocks.3.title": "Socios medibles",
    "logistics.blocks.3.desc":
      "Coordinamos transporte y última milla para reducir riesgos de traspaso y mejorar la previsibilidad.",

    "contact.title": "Contacto",
    "contact.lede": "Cuéntanos qué mueves y a dónde debe llegar.",
    "contact.form.name": "Nombre",
    "contact.form.email": "Email",
    "contact.form.phone": "Teléfono (opcional)",
    "contact.form.topic": "Asunto",
    "contact.form.message": "Mensaje",
    "contact.form.send": "Enviar mensaje",
    "contact.note": "Este formulario es una demo (sin backend). Conectamos envíos bajo pedido.",

    "footer.note": "© Met71 Spain. Coordinación de comercio internacional entre Europa y Norte de África.",
  },

  ar: {
    "meta.company": "Met71 Spain",
    "meta.tagline": "تجارة بين أوروبا وشمال أفريقيا — بشكل عملي.",

    "nav.home": "الرئيسية",
    "nav.about": "من نحن",
    "nav.services": "الخدمات",
    "nav.industries": "القطاعات",
    "nav.logistics": "اللوجستيات",
    "nav.contact": "تواصل معنا",

    "cta.primary": "اطلب عرض سعر",
    "cta.secondary": "استعرض الخدمات",

    "home.hero.title": "تجارة إسبانيا–مصر… من البداية للنهاية.",
    "home.hero.subtitle":
      "تدعم Met71 Spain عمليات الاستيراد والتصدير عبر المستندات الجمركية وتحليل السوق وإدارة اللوجستيات — بسرعة والتزام بالأنظمة.",
    "home.hero.points.1": "استيراد: سيارات أوروبية فاخرة + معدات مكافحة الحريق",
    "home.hero.points.2": "تصدير: منتجات زراعية وأسمدة مع دعم سلسلة التبريد",
    "home.hero.points.3": "جمارك وأنظمة ولوجستيات… ضمن عملية واحدة منسّقة",

    "home.stats.1.title": "إسبانيا + مصر",
    "home.stats.1.desc": "عمليات رئيسية في إسبانيا مع حضور استراتيجي في مصر.",
    "home.stats.2.title": "سلسلة تبريد",
    "home.stats.2.desc": "إمكانات نقل مُتحكَّم بالحرارة للشحنات الحساسة.",
    "home.stats.3.title": "تعدد قطاعات",
    "home.stats.3.desc": "السيارات، السلامة من الحريق، والزراعة — تحت سقف واحد.",

    "home.services.import.title": "الاستيراد",
    "home.services.import.desc":
      "استيراد علامات سيارات أوروبية فاخرة، ومعدات مكافحة الحريق وقطع الغيار — مع تنسيق وتخليص بدقة.",
    "home.services.export.title": "التصدير",
    "home.services.export.desc":
      "تصدير منتجات زراعية عالية الجودة وأسمدة، مع لوجستيات مُتحكَّم بالحرارة عند الحاجة.",
    "home.services.trade.title": "خدمات التجارة",
    "home.services.trade.desc":
      "مستندات جمركية، وتحليل سوق، وإدارة لوجستيات لتبسيط التجارة الدولية.",

    "about.title": "مصمّمون للتجارة المعقّدة.",
    "about.lede":
      "Met71 Spain شركة دولية للاستيراد والتصدير، تتمركز عملياتها في إسبانيا مع حضور استراتيجي في مصر، لتسهيل التجارة بين أوروبا وشمال أفريقيا.",
    "about.blocks.1.title": "الأنظمة… بدون تعقيد",
    "about.blocks.1.desc":
      "ندير متطلبات متعددة الجهات، والمستندات، والإجراءات الجمركية بعقلية " +
      "\"الالتزام أولاً\".",
    "about.blocks.2.title": "تنفيذ واعٍ بالسوق",
    "about.blocks.2.desc":
      "نمزج تحليل السوق بالتخطيط التشغيلي لتكون القرارات قابلة للتنفيذ عبر الحدود.",
    "about.blocks.3.title": "تنسيق تشغيلي",
    "about.blocks.3.desc":
      "من المورّدين إلى شركاء الشحن، نُبقي جميع الأطراف على نفس المسار لتقليل التأخير.",

    "services.title": "الخدمات",
    "services.lede": "نطاق واضح. خطوات قابلة للقياس. اختناقات أقل.",

    "services.import.title": "الاستيراد (أوروبا → شمال أفريقيا)",
    "services.import.items.1": "سيارات أوروبية فاخرة (تأمين المصدر + تنسيق النقل)",
    "services.import.items.2": "معدات مكافحة الحريق وقطع الغيار الحرجة",
    "services.import.items.3": "دعم المستندات والتخليص الجمركي",

    "services.export.title": "التصدير (شمال أفريقيا → أوروبا)",
    "services.export.items.1": "منتجات زراعية عالية الجودة",
    "services.export.items.2": "أسمدة ومدخلات زراعية مرتبطة",
    "services.export.items.3": "لوجستيات مُتحكَّم بالحرارة للشحنات الحساسة",

    "services.support.title": "تمكين التجارة",
    "services.support.items.1": "إدارة المستندات والتنسيق التنظيمي",
    "services.support.items.2": "تحليل سوق ودعم البحث عن الشركاء",
    "services.support.items.3": "إدارة لوجستيات شاملة",

    "industries.title": "القطاعات",
    "industries.lede": "تنفيذ متخصص لقطاعات تختلف فيها المخاطر والمتطلبات.",
    "industries.auto.title": "السيارات",
    "industries.auto.desc": "استيراد سيارات فاخرة مع عناية بالمناولة ودقة في المستندات.",
    "industries.fire.title": "السلامة من الحريق",
    "industries.fire.desc": "استيراد معدات وقطع غيار حرجة حيث التوقيت عامل حاسم.",
    "industries.agri.title": "الزراعة",
    "industries.agri.desc":
      "تصدير منتجات زراعية وأسمدة، مع دعم سلسلة التبريد عند الحاجة.",

    "logistics.title": "اللوجستيات والمناولة",
    "logistics.lede": "عندما تكون التجارة معقّدة، يجب أن تكون اللوجستيات واضحة — لا مبسّطة بشكل مخل.",
    "logistics.blocks.1.title": "جاهزية سلسلة التبريد",
    "logistics.blocks.1.desc":
      "مناولة مُتحكَّم بالحرارة للحفاظ على جودة المنتجات من المصدر حتى الوجهة.",
    "logistics.blocks.2.title": "المستندات كمسار عمل",
    "logistics.blocks.2.desc":
      "نتعامل مع الأوراق كجزء من التشغيل: تتبّع ومراجعة وربط بمراحل الشحنة.",
    "logistics.blocks.3.title": "شركاء يمكن قياسهم",
    "logistics.blocks.3.desc":
      "ننسّق مع شركاء الشحن والتوصيل لتقليل مخاطر التسليمات المتعددة وتحسين التوقعات.",

    "contact.title": "تواصل معنا",
    "contact.lede": "أخبرنا ما الذي ستشحنه وإلى أين يجب أن يصل.",
    "contact.form.name": "الاسم",
    "contact.form.email": "البريد الإلكتروني",
    "contact.form.phone": "الهاتف (اختياري)",
    "contact.form.topic": "الموضوع",
    "contact.form.message": "الرسالة",
    "contact.form.send": "إرسال",
    "contact.note": "هذا النموذج للعرض فقط (بدون خادم). يمكننا ربطه عند الطلب.",

    "footer.note": "© Met71 Spain. تنسيق تجارة دولية بين أوروبا وشمال أفريقيا.",
  },
};
