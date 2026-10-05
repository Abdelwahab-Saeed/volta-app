import { useTranslation } from "react-i18next";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { GOVERNORATES } from "@/lib/governorates";

// Delivery fields shared by the cart checkout and the offer checkout. Form setup and pre-fill: useDeliveryForm.js.

export default function DeliveryFields({ register, errors, setValue }) {
    const { t, i18n } = useTranslation();

    return (
        <>
            {/* Full Name */}
            <div>
                <Label htmlFor="full_name" className="text-start block mb-2">
                    {t('checkout.full_name')}
                </Label>
                <Input
                    id="full_name"
                    placeholder={t('checkout.full_name_placeholder')}
                    className="text-start"
                    {...register("full_name", {
                        required: t('checkout.full_name_required')
                    })}
                />
                {errors.full_name && (
                    <p className="text-red-500 text-sm mt-1 text-start">
                        {errors.full_name.message}
                    </p>
                )}
            </div>

            {/* Phone Numbers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="phone_number" className="text-start block mb-2">
                        {t('checkout.phone')}
                    </Label>
                    <Input
                        id="phone_number"
                        placeholder="01xxxxxxxxx"
                        className="text-start"
                        {...register("phone_number", {
                            required: t('checkout.phone_required'),
                            pattern: {
                                value: /^01[0-9]{9}$/,
                                message: t('checkout.phone_invalid')
                            }
                        })}
                    />
                    {errors.phone_number && (
                        <p className="text-red-500 text-sm mt-1 text-start">
                            {errors.phone_number.message}
                        </p>
                    )}
                </div>
                <div>
                    <Label htmlFor="phone_number_backup" className="text-start block mb-2">
                        {t('checkout.phone_backup')}
                    </Label>
                    <Input
                        id="phone_number_backup"
                        placeholder="01xxxxxxxxx"
                        className="text-start"
                        {...register("phone_number_backup", {
                            pattern: {
                                value: /^01[0-9]{9}$/,
                                message: t('checkout.phone_invalid')
                            }
                        })}
                    />
                    {errors.phone_number_backup && (
                        <p className="text-red-500 text-sm mt-1 text-start">
                            {errors.phone_number_backup.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Governorate and City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="state" className="text-start block mb-2">
                        {t('checkout.state')}
                    </Label>
                    <select
                        id="state"
                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-start bg-white"
                        {...register("state", {
                            required: t('checkout.state_required')
                        })}
                    >
                        <option value="" disabled>{t('checkout.state_placeholder')}</option>
                        {GOVERNORATES.map((gov) => (
                            <option key={gov.en} value={gov.en}>
                                {i18n.language === 'ar' ? gov.ar : gov.en}
                            </option>
                        ))}
                    </select>
                    {errors.state && (
                        <p className="text-red-500 text-sm mt-1 text-start">
                            {errors.state.message}
                        </p>
                    )}
                </div>
                <div>
                    <Label htmlFor="city" className="text-start block mb-2">
                        {t('checkout.city')}
                    </Label>
                    <Input
                        id="city"
                        placeholder={t('checkout.city_placeholder')}
                        className="text-start"
                        {...register("city", {
                            required: t('checkout.city_required')
                        })}
                    />
                    {errors.city && (
                        <p className="text-red-500 text-sm mt-1 text-start">
                            {errors.city.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Address Line */}
            <div>
                <Label htmlFor="address_line" className="text-start block mb-2">
                    {t('checkout.address')}
                </Label>
                <Input
                    id="address_line"
                    placeholder={t('checkout.address_placeholder')}
                    className="text-start"
                    {...register("address_line", {
                        required: t('checkout.address_required')
                    })}
                />
                {errors.address_line && (
                    <p className="text-red-500 text-sm mt-1 text-start">
                        {errors.address_line.message}
                    </p>
                )}
            </div>

            {/* Shipping Method */}
            <div>
                <Label className="text-start block mb-3 font-semibold">
                    {t('checkout.shipping_method')}
                </Label>
                <RadioGroup
                    defaultValue="home"
                    onValueChange={(value) => setValue("shipping_way", value)}
                >
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <Label htmlFor="shipping-home" className="flex-1 cursor-pointer text-start">
                            {t('checkout.home_delivery')}
                        </Label>
                        <RadioGroupItem value="home" id="shipping-home" />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer mt-2">
                        <Label htmlFor="shipping-pickup" className="flex-1 cursor-pointer text-start">
                            {t('checkout.pickup_from_branch')}
                        </Label>
                        <RadioGroupItem value="pickup" id="shipping-pickup" />
                    </div>
                </RadioGroup>
                {errors.shipping_way && (
                    <p className="text-red-500 text-sm mt-1 text-start">
                        {errors.shipping_way.message}
                    </p>
                )}
            </div>

            {/* Payment Method */}
            <div className="border-2 border-primary/20 rounded-lg p-4">
                <Label className="text-start block mb-3 font-semibold">
                    {t('checkout.payment_method')}
                </Label>
                <RadioGroup
                    defaultValue="cash"
                    onValueChange={(value) => setValue("payment_method", value)}
                >
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <Label htmlFor="payment-cash" className="flex-1 cursor-pointer text-start">
                                {t('checkout.cash_on_delivery')}
                            </Label>
                            <RadioGroupItem value="cash" id="payment-cash" />
                        </div>
                    </div>
                </RadioGroup>
                {errors.payment_method && (
                    <p className="text-red-500 text-sm mt-1 text-start">
                        {errors.payment_method.message}
                    </p>
                )}
            </div>

            {/* Order Notes */}
            <div>
                <Label htmlFor="notes" className="text-start block mb-2 font-semibold">
                    {t('checkout.order_notes')}
                </Label>
                <Textarea
                    id="notes"
                    placeholder={t('checkout.order_notes_placeholder')}
                    className="text-start min-h-[120px]"
                    {...register("notes")}
                />
            </div>
        </>
    );
}
