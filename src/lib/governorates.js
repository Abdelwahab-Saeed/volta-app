// Egyptian governorates, shared by the checkout delivery form and the saved-addresses form.
// The English name is the value sent to the API; the label follows the UI language.

export const GOVERNORATES = [
    { en: "Cairo", ar: "القاهرة" },
    { en: "Alexandria", ar: "الإسكندرية" },
    { en: "Port Said", ar: "بورسعيد" },
    { en: "Suez", ar: "السويس" },
    { en: "Damietta", ar: "دمياط" },
    { en: "Dakahlia", ar: "الدقهلية" },
    { en: "Sharqia", ar: "الشرقية" },
    { en: "Qalyubia", ar: "القليوبية" },
    { en: "Kafr El Sheikh", ar: "كفر الشيخ" },
    { en: "Gharbia", ar: "الغربية" },
    { en: "Monufia", ar: "المنوفية" },
    { en: "Beheira", ar: "البحيرة" },
    { en: "Ismailia", ar: "الإسماعيلية" },
    { en: "Giza", ar: "الجيزة" },
    { en: "Beni Suef", ar: "بني سويف" },
    { en: "Fayoum", ar: "الفيوم" },
    { en: "Minya", ar: "المنيا" },
    { en: "Assiut", ar: "أسيوط" },
    { en: "Sohag", ar: "سوهاج" },
    { en: "Qena", ar: "قنا" },
    { en: "Luxor", ar: "الأقصر" },
    { en: "Aswan", ar: "أسوان" },
    { en: "Red Sea", ar: "البحر الأحمر" },
    { en: "New Valley", ar: "الوادي الجديد" },
    { en: "Matrouh", ar: "مطروح" },
    { en: "North Sinai", ar: "شمال سيناء" },
    { en: "South Sinai", ar: "جنوب سيناء" }
];

const findGovernorate = (value) => {
    if (!value) return undefined;
    const trimmed = value.trim();
    const lower = trimmed.toLowerCase();
    return GOVERNORATES.find(g => g.en.toLowerCase() === lower || g.ar === trimmed);
};

/** Normalises a stored value (English or Arabic name) to the English option value; unknown values pass through. */
export const getMatchedGovernorate = (value) => {
    if (!value) return "";
    return findGovernorate(value)?.en ?? value;
};

/** Display name of a stored governorate value in the given language; unknown values pass through. */
export const governorateLabel = (value, language) => {
    const gov = findGovernorate(value);
    if (!gov) return value || "";
    return language === 'ar' ? gov.ar : gov.en;
};
