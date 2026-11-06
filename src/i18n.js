import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      // Navigation
      dashboard: "Tableau de bord", 
      claims: "Réclamations", 
      map: "Carte", 
      agents: "Agents", 
      settings: "Paramètres", 
      logout: "Déconnexion", 
      
      // Actions communes
      search: "Rechercher...", 
      save: "Enregistrer",
      cancel: "Annuler",
      delete: "Supprimer",
      modify: "Modifier",
      
      // Paramètres
      profile: "Mon Profil", 
      superAdmin: "Super Administrateur",
      agent: "Agent", 
      email: "Aucun email renseigné", 
      access: "Accès", 
      total: "Total",
      restricted: "Restreint", 
      prefs: "Préférences de l'application",
      theme: "Thème (Clair / Sombre)", 
      language: "Langue", 
      systemStatus: "État du Système",
      db: "Base de données", 
      api: "API Backend", 
      online: "En ligne", 
      connected: "Connectée",
      light: "Clair", 
      dark: "Sombre", 
      system: "Système", 
      french: "Français", 
      english: "Anglais", 
      arabic: "Arabe",
      notifications: "Notifications Push",
      receiveAlerts: "Recevoir des alertes système",
      security: "Sécurité",
      changePassword: "Changer le mot de passe",
      disconnectConfirm: "Voulez-vous vraiment vous déconnecter ?"
    }
  },
  en: {
    translation: {
      dashboard: "Dashboard", 
      claims: "Claims", 
      map: "Map", 
      agents: "Agents", 
      settings: "Settings", 
      logout: "Logout", 
      search: "Search...", 
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      modify: "Modify",
      
      profile: "My Profile", 
      superAdmin: "Super Admin", 
      agent: "Agent", 
      email: "No email provided", 
      access: "Access", 
      total: "Total", 
      restricted: "Restricted",
      prefs: "Application Preferences", 
      theme: "Theme (Light / Dark)", 
      language: "Language", 
      systemStatus: "System Status", 
      db: "Database", 
      api: "Backend API", 
      online: "Online", 
      connected: "Connected",
      light: "Light", 
      dark: "Dark", 
      system: "System", 
      french: "French", 
      english: "English", 
      arabic: "Arabic",
      notifications: "Push Notifications",
      receiveAlerts: "Receive system alerts",
      security: "Security",
      changePassword: "Change password",
      disconnectConfirm: "Are you sure you want to log out?"
    }
  },
  ar: {
    translation: {
      dashboard: "لوحة القيادة", 
      claims: "الشكاوى", 
      map: "الخريطة", 
      agents: "الموظفين", 
      settings: "الإعدادات", 
      logout: "تسجيل الخروج", 
      search: "بحث...", 
      save: "حفظ",
      cancel: "إلغاء",
      delete: "حذف",
      modify: "تعديل",
      
      profile: "ملفي الشخصي", 
      superAdmin: "مدير عام", 
      agent: "موظف", 
      email: "لا يوجد بريد إلكتروني", 
      access: "الوصول", 
      total: "كلي", 
      restricted: "محدود",
      prefs: "تفضيلات التطبيق", 
      theme: "المظهر (فاتح / داكن)", 
      language: "اللغة",
      systemStatus: "حالة النظام", 
      db: "قاعدة البيانات", 
      api: "واجهة الخلفية", 
      online: "متصل", 
      connected: "متصل", 
      light: "فاتح", 
      dark: "داكن", 
      system: "النظام", 
      french: "الفرنسية", 
      english: "الإنجليزية", 
      arabic: "العربية",
      notifications: "إشعارات الدفع",
      receiveAlerts: "تلقي تنبيهات النظام",
      security: "الأمن",
      changePassword: "تغيير كلمة المرور",
      disconnectConfirm: "هل أنت متأكد أنك تريد تسجيل الخروج؟"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('sawtak-lang') || 'fr',
  fallbackLng: 'fr',
  interpolation: { escapeValue: false }
});

// ✅ Gestion automatique du sens de lecture (RTL pour l'arabe)
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  localStorage.setItem('sawtak-lang', lng);
});

export default i18n;