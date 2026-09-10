import { useState } from "react";

type RegisterForm = {
  fname: string;
  lname: string;
  plan: string;
  gender: string;
  extraItems: string[];
};

const plans = [
  { id: "funrun", label: "Fun run 5.5 Km", price: 500 },
  { id: "mini", label: "Mini Marathon 10 Km", price: 800 },
  { id: "half", label: "Half Marathon 21 Km", price: 1200 },
  { id: "full", label: "Full Marathon 42.195 Km", price: 1500 },
];

// ---- ข้อมูล Array สำหรับสินค้าเสริม ----
const extraItems = [
  { id: "bottle", label: "Bottle 🍼", price: 200 },
  { id: "shoes", label: "Shoes 👟", price: 600 },
  { id: "cap", label: "Cap 🧢", price: 400 },
];

export default function ModalRegister({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<RegisterForm>({
    fname: "",
    lname: "",
    plan: "",
    gender: "",
    extraItems: [],
  });

  const [agree, setAgree] = useState(false);

  const [errors, setErrors] = useState({
    fname: false,
    lname: false,
    plan: false,
    gender: false,
    extraItems: false,
  });

  const updateForm = (key: keyof RegisterForm, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    //5.2. การอัปเดตฟอร์มพร้อมล้างสถานะ Error
    setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const computeTotalPayment = () => {
    let total = 0;

    const selectedPlan = plans.find((p) => p.id === form.plan);
    if (selectedPlan) total += selectedPlan.price;

    let extraTotal = 0;
    form.extraItems.forEach((itemId) => {
      const item = extraItems.find((i) => i.id === itemId);
      if (item) extraTotal += item.price;
    });

    let finalTotal = total + extraTotal;

    if (form.extraItems.length === extraItems.length) {
      finalTotal = finalTotal * 0.8;
    }

    return finalTotal;
  };

  const registerBtnOnClick = () => {
    const newErrors = {
      fname: form.fname === "",
      lname: form.lname === "",
      plan: form.plan === "",
      gender: form.gender === "",
      extraItems: false,
    };
    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((isError) => isError);
    if (hasError) return;

    const total = computeTotalPayment();

    alert(
      `Registration complete. Please pay money for ${total.toLocaleString()} THB.`,
    );

    const newRegistration = {
      id: Date.now(),
      fullName: `${form.fname} ${form.lname}`.trim(),
      gender: form.gender,
      plan: form.plan,
      extraItems: form.extraItems,
      total: total,
    };  

    const existingData = localStorage.getItem("marathon-users");
    const usersArray = existingData ? JSON.parse(existingData) : [];
    usersArray.push(newRegistration);

    localStorage.setItem("marathon-users", JSON.stringify(usersArray));

    onClose();
  };

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Register CMU Marathon 🏃‍♂️</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body">
              <div className="d-flex gap-2">
                <div className="w-50">
                  <label className="form-label">First name</label>
                  <input
                    className={`form-control ${errors.fname ? "is-invalid" : ""}`}
                    onChange={(e) => updateForm("fname", e.target.value)}
                    value={form.fname}
                  />
                  <div className="invalid-feedback">Invalid first name</div>
                </div>
                <div className="w-50">
                  <label className="form-label">Last name</label>
                  <input
                    className={`form-control ${errors.lname ? "is-invalid" : ""}`}
                    onChange={(e) => updateForm("lname", e.target.value)}
                    value={form.lname}
                  />
                  <div className="invalid-feedback">Invalid last name</div>
                </div>
              </div>

              <div className="mt-2">
                <label className="form-label">Plan</label>
                <select
                  className={"form-select" + (errors.plan ? " is-invalid" : "")}
                  onChange={(e) => updateForm("plan", e.target.value)}
                  value={form.plan}
                >
                  <option value="">Please select..</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label} ({p.price.toLocaleString()} THB)
                    </option>
                  ))}
                </select>
                <div className="invalid-feedback">Please select a Plan</div>
              </div>
              <div className="mt-2">
                <label className="form-label">Gender</label>
                <div>
                  <input
                    className="me-2 form-check-input"
                    type="radio"
                    checked={form.gender === "male"}
                    onChange={() => updateForm("gender", "male")}
                  />
                  Male 👨
                  <input
                    className="mx-2 form-check-input"
                    type="radio"
                    checked={form.gender === "female"}
                    onChange={() => updateForm("gender", "female")}
                  />
                  Female 👩
                </div>
                {errors.gender && (
                  <div className="text-danger" style={{ fontSize: "0.875em" }}>
                    Please select gender
                  </div>
                )}
              </div>

              {/* ----- ฟีเจอร์สินค้าเสริม (Extra Items) ----- */}
              <div className="mt-2">
                <label className="form-label">Extra Item(s)</label>
                {extraItems.map((item) => (
                  <div key={item.id}>
                    <input
                      className="me-2 form-check-input"
                      type="checkbox"
                      checked={form.extraItems.includes(item.id)}
                      onChange={(e) => {
                        const newExtraItems = e.target.checked
                          ? [...form.extraItems, item.id]
                          : form.extraItems.filter((id) => id !== item.id);
                        updateForm("extraItems", newExtraItems);
                      }}
                    />
                    <label className="form-check-label">
                      {item.label} ({item.price.toLocaleString()} THB)
                    </label>
                  </div>
                ))}
                {errors.extraItems && (
                  <div className="text-danger" style={{ fontSize: "0.875em" }}>
                    Please select at least one item
                  </div>
                )}
                {/* Conditional Rendering แสดงข้อความลดราคา 20% */}
                {form.extraItems.length === extraItems.length && (
                  <span className="text-success d-block">(20% Discounted)</span>
                )}
              </div>

              <div className="alert alert-primary mt-3 py-3" role="alert">
                Promotion📢 Buy all items to get 20% Discount
              </div>

              <div className="mt-3">
                Total Payment : {computeTotalPayment().toLocaleString()} THB
              </div>
            </div>

            <div className="modal-footer d-flex justify-content-end align-items-center gap-3">
              <div className="form-check mb-0">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                I agree to the terms and conditions
              </div>
              <button
                className="btn btn-success"
                onClick={registerBtnOnClick}
                disabled={!agree}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
