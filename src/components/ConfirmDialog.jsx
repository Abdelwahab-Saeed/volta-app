import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  type = 'warning',
  confirmText,
  cancelText,
}) {
  const { t } = useTranslation();
  const finalConfirmText = confirmText || t('common.confirm');
  const finalCancelText = cancelText || t('common.cancel');
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-md p-4">
        <DialogHeader className="mt-4">
          <DialogTitle className="text-center text-xl">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-center text-gray-600">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="flex-1 text-secondary border-secondary hover:bg-gray-100 text-base hover:text-secondary rounded"
          >
            {finalCancelText}
          </Button>
          <Button
            type="button"
            variant={type === 'warning' ? 'destructive' : 'secondary'}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 text-base rounded"
          >
            {finalConfirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
