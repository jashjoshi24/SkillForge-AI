CERTIFICATIONS_DATABASE = [
    # Backend Developer
    {
        "id": "cert-be-01",
        "title": "AWS Certified Developer – Associate",
        "provider": "Amazon Web Services",
        "domain": "Backend Developer",
        "difficulty": "Intermediate",
        "skill_tag": "Cloud Computing",
        "estimated_duration": "2-3 months",
        "cost": "$150",
        "url": "https://aws.amazon.com/certification/certified-developer-associate/",
        "description": "Validates technical expertise in developing, deploying, and debugging cloud-based applications using AWS."
    },
    {
        "id": "cert-be-02",
        "title": "CKAD: Certified Kubernetes Application Developer",
        "provider": "CNCF / Linux Foundation",
        "domain": "Backend Developer",
        "difficulty": "Advanced",
        "skill_tag": "Docker & Kubernetes",
        "estimated_duration": "3 months",
        "cost": "$395",
        "url": "https://training.linuxfoundation.org/certification/certified-kubernetes-application-developer-ckad/",
        "description": "Demonstrates ability to design, build, configure, and expose cloud native applications for Kubernetes."
    },
    {
        "id": "cert-be-03",
        "title": "Oracle Certified Professional: Java SE Developer",
        "provider": "Oracle",
        "domain": "Backend Developer",
        "difficulty": "Intermediate",
        "skill_tag": "Java / Spring Boot",
        "estimated_duration": "2 months",
        "cost": "$245",
        "url": "https://education.oracle.com/java-se-17-developer/pexam_1Z0-829",
        "description": "Proves proficiency in Java programming language, core libraries, and backend application architecture."
    },

    # Frontend Developer
    {
        "id": "cert-fe-01",
        "title": "Meta Frontend Developer Professional Certificate",
        "provider": "Meta (Coursera)",
        "domain": "Frontend Developer",
        "difficulty": "Beginner",
        "skill_tag": "React & Modern JS",
        "estimated_duration": "4 months",
        "cost": "Subscription",
        "url": "https://www.coursera.org/professional-certificates/meta-front-end-developer",
        "description": "Comprehensive program covering HTML, CSS, JavaScript, React, and UX design fundamentals."
    },
    {
        "id": "cert-fe-02",
        "title": "Open JS Node.js Application Developer (JSNAD)",
        "provider": "Linux Foundation / OpenJS",
        "domain": "Frontend Developer",
        "difficulty": "Intermediate",
        "skill_tag": "Node.js & Fullstack",
        "estimated_duration": "2 months",
        "cost": "$395",
        "url": "https://training.linuxfoundation.org/certification/jsnad/",
        "description": "Validates skill in creating REST APIs, web servers, and CLI utilities with Node.js."
    },

    # Data Analyst
    {
        "id": "cert-da-01",
        "title": "Google Data Analytics Professional Certificate",
        "provider": "Google (Coursera)",
        "domain": "Data Analyst",
        "difficulty": "Beginner",
        "skill_tag": "Data Visualization & SQL",
        "estimated_duration": "3-6 months",
        "cost": "Subscription",
        "url": "https://www.coursera.org/professional-certificates/google-data-analytics",
        "description": "Gain entry-level skills in data cleaning, SQL, R, Tableau, and data-driven decision making."
    },
    {
        "id": "cert-da-02",
        "title": "Microsoft Certified: Power BI Data Analyst Associate",
        "provider": "Microsoft",
        "domain": "Data Analyst",
        "difficulty": "Intermediate",
        "skill_tag": "Power BI & Analytics",
        "estimated_duration": "2 months",
        "cost": "$165",
        "url": "https://learn.microsoft.com/en-us/credentials/certifications/data-analyst-associate/",
        "description": "Delivers actionable insights by leveraging data modeling, Power BI reports, and dashboard design."
    },

    # ML Engineer
    {
        "id": "cert-ml-01",
        "title": "AWS Certified Machine Learning – Specialty",
        "provider": "Amazon Web Services",
        "domain": "ML Engineer",
        "difficulty": "Advanced",
        "skill_tag": "Machine Learning Pipelines",
        "estimated_duration": "3-4 months",
        "cost": "$300",
        "url": "https://aws.amazon.com/certification/certified-machine-learning-specialty/",
        "description": "Validates expertise in designing, implementing, deploying, and maintaining ML solutions on AWS."
    },
    {
        "id": "cert-ml-02",
        "title": "DeepLearning.AI Machine Learning Specialization",
        "provider": "DeepLearning.AI (Coursera)",
        "domain": "ML Engineer",
        "difficulty": "Intermediate",
        "skill_tag": "Deep Learning & PyTorch",
        "estimated_duration": "3 months",
        "cost": "Subscription",
        "url": "https://www.coursera.org/specializations/machine-learning-introduction",
        "description": "Master fundamental Machine Learning concepts, supervised/unsupervised learning, and neural networks."
    },

    # DevOps
    {
        "id": "cert-do-01",
        "title": "Certified Kubernetes Administrator (CKA)",
        "provider": "CNCF / Linux Foundation",
        "domain": "DevOps",
        "difficulty": "Advanced",
        "skill_tag": "Infrastructure & K8s",
        "estimated_duration": "3 months",
        "cost": "$395",
        "url": "https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/",
        "description": "Proves skills in Kubernetes installation, cluster configuration, networking, storage, and security."
    },
    {
        "id": "cert-do-02",
        "title": "HashiCorp Certified: Terraform Associate",
        "provider": "HashiCorp",
        "domain": "DevOps",
        "difficulty": "Intermediate",
        "skill_tag": "Infrastructure as Code",
        "estimated_duration": "1-2 months",
        "cost": "$70",
        "url": "https://www.hashicorp.com/certification/terraform-associate",
        "description": "Demonstrates core concepts and skills required to provision infrastructure with HashiCorp Terraform."
    },

    # Cybersecurity
    {
        "id": "cert-sec-01",
        "title": "CompTIA Security+",
        "provider": "CompTIA",
        "domain": "Cybersecurity",
        "difficulty": "Beginner",
        "skill_tag": "Network Security",
        "estimated_duration": "2 months",
        "cost": "$392",
        "url": "https://www.comptia.org/certifications/security",
        "description": "Globally trusted certification validating foundational cybersecurity knowledge and hands-on skills."
    },
    {
        "id": "cert-sec-02",
        "title": "Certified Ethical Hacker (CEH)",
        "provider": "EC-Council",
        "domain": "Cybersecurity",
        "difficulty": "Intermediate",
        "skill_tag": "Penetration Testing",
        "estimated_duration": "3 months",
        "cost": "$1,199",
        "url": "https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/",
        "description": "Master ethical hacking techniques, penetration testing methods, and vulnerability assessment tools."
    }
]

def get_certifications_by_domain(domain: str = None):
    if not domain:
        return CERTIFICATIONS_DATABASE
    
    domain_lower = domain.lower()
    matching = [
        cert for cert in CERTIFICATIONS_DATABASE
        if cert["domain"].lower() in domain_lower or domain_lower in cert["domain"].lower()
    ]
    return matching if matching else CERTIFICATIONS_DATABASE
