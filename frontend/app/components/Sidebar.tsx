// app/components/Sidebar.tsx
import { Building2, Factory, DollarSign, TrendingUp, Wallet, Target, Circle } from "lucide-react";

export default function Sidebar({ profile, documents }: any) {
  return (
    <div className="flex flex-col gap-4 min-h-0">
      
      {/* Profile Card */}
      <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col min-h-0">
        <h2 className="font-bold text-md mb-4 text-slate-800">Borrower Profile</h2>

        <div className="space-y-3 overflow-y-auto pr-2">
          <ProfileItem icon={<Building2 size={16}/>} label="Company Name" value={profile.company_name} />
          <ProfileItem icon={<Factory size={16}/>} label="Industry" value={profile.industry} />
          <ProfileItem icon={<DollarSign size={16}/>} label="Revenue Last Year" value={profile.revenue} />
          <ProfileItem icon={<TrendingUp size={16}/>} label="Profitability Status" value={profile.profitability} />
          <ProfileItem icon={<Wallet size={16}/>} label="Funding Amount" value={profile.funding_amount} />
          <ProfileItem icon={<Target size={16}/>} label="Funding Purpose" value={profile.purpose} />
        </div>
      </section>

      {/* Documents */}
      <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="font-bold text-md mb-3 text-slate-800">Documents Needed</h2>

        <ul className="space-y-3">
          {documents.map((doc: string, i: number) => (
            <DocumentItem key={i} label={doc} />
          ))}
        </ul>
      </section>

    </div>
  );
}

function ProfileItem({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-slate-50 rounded-lg text-slate-400 border">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase text-slate-400">{label}</p>
        <p className="text-xs font-medium text-slate-700">
          {value || "Pending..."}
        </p>
      </div>
    </div>
  );
}

function DocumentItem({ label }: any) {
  return (
    <li className="flex items-center gap-3 text-slate-600">
      <Circle size={16} className="text-slate-300" />
      <span className="text-xs font-medium">{label}</span>
    </li>
  );
}