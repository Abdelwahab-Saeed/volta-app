import { useTranslation } from 'react-i18next';
import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { AlertTriangle } from 'lucide-react';

export default function DeleteAddressModal({ open, onClose, onConfirm, loading }) {
    const { t } = useTranslation();
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-sm rounded-lg p-6">
                <DialogHeader className="flex flex-col items-center gap-4 text-center">
                    <div className="bg-red-100 p-3 rounded-full">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <DialogTitle className="text-xl font-bold text-gray-900">{t('address.delete_confirm_title')}</DialogTitle>
                    <DialogDescription className="text-gray-600">
                        {t('address.delete_confirm_desc')}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex gap-3 pt-4 sm:justify-center">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 text-gray-700 border-gray-300 hover:bg-gray-50"
                    >
                        {t('address.cancel')}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                        {loading ? t('address.deleting') : t('address.confirm_delete')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
