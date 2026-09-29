import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useAuthStore } from "@/stores/useAuthStore";
import { useAddressStore } from "@/stores/useAddressStore";

// Delivery details shared by the cart checkout and the offer checkout (fields: DeliveryFields.jsx).

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

const getMatchedGovernorate = (dbValue) => {
    if (!dbValue) return "";
    const lowerVal = dbValue.toLowerCase().trim();
    const gov = GOVERNORATES.find(g =>
        g.en.toLowerCase() === lowerVal || g.ar === dbValue.trim()
    );
    return gov ? gov.en : dbValue;
};

/**
 * react-hook-form setup for the delivery fields, pre-filled from the signed-in user and their first saved address.
 */
export function useDeliveryForm(extraDefaults = {}) {
    const { user } = useAuthStore();

    const form = useForm({
        defaultValues: {
            full_name: user?.name || "",
            phone_number: user?.phone_number || "",
            phone_number_backup: user?.backup_phone_number || "",
            state: "",
            city: "",
            shipping_way: "home",
            payment_method: "cash",
            notes: "",
            address_line: "",
            ...extraDefaults
        }
    });
    const { setValue } = form;

    // Update form default values when user loads
    useEffect(() => {
        if (user) {
            setValue('full_name', user.name || "");
            setValue('phone_number', user.phone_number || "");
        }
    }, [user, setValue]);

    // Fetch addresses and pre-fill
    const { addresses, fetchAddresses } = useAddressStore();

    useEffect(() => {
        if (user) {
            fetchAddresses();
        }
    }, [user, fetchAddresses]);

    useEffect(() => {
        if (addresses && addresses.length > 0) {
            const firstAddress = addresses[0];
            setValue('state', getMatchedGovernorate(firstAddress.city) || "");
            setValue('city', firstAddress.state || "");
            const fullAddress = [firstAddress.address_line_1, firstAddress.address_line_2].filter(Boolean).join(' ');
            setValue('address_line', fullAddress || "");
            if (firstAddress.recipient_name) setValue('full_name', firstAddress.recipient_name);
            if (firstAddress.phone_number) setValue('phone_number', firstAddress.phone_number);
            if (firstAddress.backup_phone_number) setValue('phone_number_backup', firstAddress.backup_phone_number);
        }
    }, [addresses, setValue]);

    return form;
}
