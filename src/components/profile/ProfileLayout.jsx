import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { LogOut, MapPinHouse, ShoppingCart, User } from 'lucide-react';
import ConfirmDialog from '../ConfirmDialog';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from 'sonner';

export default function ProfileLayout() {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const logoutUser = useAuthStore((state) => state.logoutUser);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success(t('header.logout_success'));
      navigate('/');
    } catch (error) {
      toast.error(t('header.logout_error'));
    }
  };

  return (
    <>
      <div className="container mx-auto flex flex-col lg:flex-row gap-6 py-8 px-4">
        <aside
          className="w-full lg:w-1/4 h-fit flex flex-col gap-2 md:gap-4 py-6 px-2 [box-shadow:0px_10px_27px_0px_#0000001A]"
        >
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `text-xl flex justify-start items-center gap-2 mx-3 p-3 ${isActive
                ? 'text-white bg-secondary'
                : 'text-primary hover:text-white hover:bg-secondary'
              }`
            }
          >
            <User size={22} />
            {t('header.profile')}
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `text-xl flex justify-start items-center gap-2 mx-3 p-3 ${isActive
                ? 'text-white bg-secondary'
                : 'text-primary hover:text-white hover:bg-secondary'
              }`
            }
          >
            <ShoppingCart size={22} />
            {t('orders.title')}
          </NavLink>

          <NavLink
            to="/addresses"
            className={({ isActive }) =>
              `text-xl flex justify-start items-center gap-2 mx-3 p-3 ${isActive
                ? 'text-white bg-secondary'
                : 'text-primary hover:text-white hover:bg-secondary'
              }`
            }
          >
            <MapPinHouse size={22} />
            {t('address.title')}
          </NavLink>
          <Button
            variant="ghost"
            className="text-xl flex justify-start items-center gap-2 mx-3 p-3 text-primary hover:text-white hover:bg-secondary h-auto"
            onClick={() => setIsDialogOpen(true)}
          >
            <LogOut style={{ width: 22, height: 22 }} />
            {t('header.logout')}
          </Button>
        </aside>
        <div className="w-full lg:w-3/4">
          <Outlet />
        </div>
      </div>

      <ConfirmDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleLogout}
        title={t('auth.logout_confirm_title')}
        description={t('auth.logout_confirm_desc')}
        type="normal"
      />
    </>
  );
}
