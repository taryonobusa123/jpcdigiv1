
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowRight } from "lucide-react";
import { EWALLET_BRAND_LOGOS } from "./ewallet-brand-logos";

type EwalletBrand = {
  name: string;
  logo: string;
  gratis?: boolean;
};

type UserEwallet = {
  name: string;
  logo: string;
  masked: string;
  balance: number;
  gratis?: boolean;
};

interface ChooseEwalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ewalletList: EwalletBrand[];
  userEwallets: UserEwallet[];
  onSelectBrand: (brand: EwalletBrand | UserEwallet) => void;
}

const ChooseEwalletModal: React.FC<ChooseEwalletModalProps> = ({
  open,
  onOpenChange,
  ewalletList,
  userEwallets,
  onSelectBrand,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden">
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <span className="font-bold text-lg">Pilih E-Wallet</span>
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100" onClick={()=>onOpenChange(false)}>
          <span className="text-2xl">&times;</span>
        </button>
      </div>
      <div className="px-5 pt-3">
        <div className="mb-2">
          <span className="block font-semibold text-[15px] mb-2">E-Wallet Saya</span>
          <div className="flex gap-2">
            {userEwallets.map((w, ix) =>
              <button key={ix} className="flex-1"
                onClick={() => { onSelectBrand(w); }}>
                <div className="rounded-xl bg-gray-50 border border-gray-200 flex flex-col items-center justify-center py-4 px-1 text-center h-24 shadow">
                  <img src={w.logo} className="w-9 h-9 mx-auto mb-1" alt={w.name} onError={(e)=>{e.currentTarget.src="/placeholder.svg";}} />
                  <div className="text-sm font-bold">{w.masked || w.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Rp {w.balance}</div>
                </div>
              </button>
            )}
            {/* Demo: OVO belom connect */}
            <button className="flex-1" onClick={() => onSelectBrand({
              name: "OVO", logo: EWALLET_BRAND_LOGOS["ovo"], masked: "OVO", balance: 0,
            })}>
              <div className="rounded-xl bg-gray-50 border border-gray-200 flex flex-col items-center justify-center py-4 px-1 text-center h-24 shadow">
                <img src={EWALLET_BRAND_LOGOS["ovo"]} className="w-9 h-9 mx-auto mb-1" alt="OVO" onError={(e)=>{e.currentTarget.src="/placeholder.svg"}}/>
                <div className="text-sm font-bold text-orange-600">OVO</div>
                <div className="text-[13px] text-orange-600 font-bold mt-0.5 flex items-center justify-center">
                  Hubungkan <ArrowRight className="w-3 h-3 inline ml-1" />
                </div>
              </div>
            </button>
          </div>
        </div>
        <div className="mt-2">
          <span className="block font-semibold text-[15px] mb-2">E-Wallet Lainnya</span>
          <div className="grid grid-cols-3 gap-3">
            {ewalletList.map((e, ix) =>
              <button key={ix} className="flex flex-col items-center justify-center py-3 bg-gray-50 rounded-xl border relative"
                onClick={()=>onSelectBrand(e)}>
                <img src={e.logo} className="w-9 h-9 mb-1" alt={e.name} onError={(e)=>{e.currentTarget.src="/placeholder.svg"}}/>
                <span className="font-medium text-xs">{e.name}</span>
                {e.gratis && <span className="absolute -top-2 -right-2 text-[11px] bg-orange-500 text-white px-2 py-0.5 rounded-full font-bold">Gratis</span>}
              </button>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default ChooseEwalletModal;
