import type { Registrant } from "../libs/Registrant";

const planMapping: Record<string, string> = {
  funrun: "Fun run 5.5 Km",
  mini: "Mini Marathon 10 Km",
  half: "Half Marathon 21 Km",
  full: "Full Marathon 42.195 Km",
};

const extraItemMapping: Record<string, string> = {
  bottle: "Bottle 🍼",
  shoes: "Shoes 👟",
  cap: "Cap 🧢",
};

export default function UserRegisterCard({ registrant }: { registrant: Registrant }) {
  return (
    <div className="card p-3 mb-3 border-1">
      <div className="d-flex justify-content-between align-items-center mb-1">
        {/* เรียกใช้ fullName */}
        <h6 className="mb-0 fw-bold">{registrant.fullName}</h6>
        {/* เรียกใช้ total */}
        <span>{registrant.total.toLocaleString()} THB</span>
      </div>

      <div className="text-muted small mb-2">
        {planMapping[registrant.plan] || registrant.plan} &middot;{" "}
        {registrant.gender === "male" ? "👨 Male" : "👩 Female"}
      </div>

      {registrant.extraItems && registrant.extraItems.length > 0 && (
        <div className="d-flex gap-2">
          {registrant.extraItems.map((item) => (
            <span key={item} className="badge bg-light text-dark border">
              {extraItemMapping[item] || item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}