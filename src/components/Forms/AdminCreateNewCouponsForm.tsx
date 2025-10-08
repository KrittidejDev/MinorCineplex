import { useState } from "react";
import ModalEmpty from "../Modals/ModalEmpty";
import { Button } from "../ui/button";
import axios from "axios";

interface CreateNewCouponFormProps {
  isShowModal: boolean;
  onClose: () => void;
}

function AdminCreateNewCouponForm({
  isShowModal,
  onClose,
}: CreateNewCouponFormProps) {
  const [formData, setFormData] = useState({
    title_en: "",
    title_th: "",
    discription_en: "",
    discription_th: "",
    code: "",
    discount_value: "",
    start_date: "",
    end_date: "",
    image: "",
    is_collected: false,
    status: "active",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      // ตรวจสอบฟิลด์จำเป็น
      if (!formData.code || !formData.discount_value || !formData.start_date || !formData.end_date) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      }

      const payload = {
        ...formData,
        discount_value: Number(formData.discount_value),
        start_date: new Date(formData.start_date),
        end_date: new Date(formData.end_date),
      };

      const res = await axios.post("/api/coupons", payload);

      if (res.status === 201) {
        alert("✅ สร้างคูปองสำเร็จ!");
        onClose();
      }
    } catch (err: unknown){
      console.error(err);
      alert("❌ สร้างคูปองไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalEmpty isShowModal={isShowModal} onClose={onClose}>
      <div className="bg-white w-[900px] rounded-md shadow-lg py-10 px-14 overflow-y-auto max-h-[90vh]">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Coupon</h1>
        <p className="text-gray-500 text-sm mb-8">
          Fill in the details below to create a new promotional coupon.
        </p>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Coupon Code + Discount */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-blue-700 text-sm font-semibold">Coupon Code</label>
              <input
                type="text"
                placeholder="e.g SMR20PC"
                value={formData.code}
                onChange={(e) => handleChange("code", e.target.value)}
                className="w-full border border-blue-300 rounded-md p-3 mt-1 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="text-blue-700 text-sm font-semibold">Discount Value</label>
              <input
                type="number"
                placeholder="e.g 500"
                value={formData.discount_value}
                onChange={(e) => handleChange("discount_value", e.target.value)}
                className="w-full border border-blue-300 rounded-md p-3 mt-1 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Title */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-blue-700 text-sm font-semibold">Title (EN)</label>
              <input
                type="text"
                placeholder="e.g. Summer Promotion"
                value={formData.title_en}
                onChange={(e) => handleChange("title_en", e.target.value)}
                className="w-full border border-blue-300 rounded-md p-3 mt-1"
              />
            </div>
            <div>
              <label className="text-blue-700 text-sm font-semibold">Title (TH)</label>
              <input
                type="text"
                placeholder="เช่น โปรหน้าร้อน"
                value={formData.title_th}
                onChange={(e) => handleChange("title_th", e.target.value)}
                className="w-full border border-blue-300 rounded-md p-3 mt-1"
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-blue-700 text-sm font-semibold">Description (EN)</label>
              <textarea
                placeholder="A brief description..."
                value={formData.discription_en}
                onChange={(e) => handleChange("discription_en", e.target.value)}
                className="w-full border border-blue-300 rounded-md p-3 mt-1"
                rows={3}
              />
            </div>
            <div>
              <label className="text-blue-700 text-sm font-semibold">Description (TH)</label>
              <textarea
                placeholder="คำอธิบายโปรโมชั่น..."
                value={formData.discription_th}
                onChange={(e) => handleChange("discription_th", e.target.value)}
                className="w-full border border-blue-300 rounded-md p-3 mt-1"
                rows={3}
              />
            </div>
          </div>

          {/* Date */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-blue-700 text-sm font-semibold">Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange("start_date", e.target.value)}
                className="w-full border border-blue-300 rounded-md p-3 mt-1"
              />
            </div>
            <div>
              <label className="text-blue-700 text-sm font-semibold">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => handleChange("end_date", e.target.value)}
                className="w-full border border-blue-300 rounded-md p-3 mt-1"
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-3 mt-4">
            <label className="text-blue-700 text-sm font-semibold">Status</label>
            <div
              onClick={() => handleChange("status", formData.status === "active" ? "inactive" : "active")}
              className={`w-12 h-6 rounded-full flex items-center cursor-pointer transition ${
                formData.status === "active" ? "bg-green-500" : "bg-gray-400"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition ${
                  formData.status === "active" ? "translate-x-6" : "translate-x-1"
                }`}
              ></div>
            </div>
            <span className="text-sm text-gray-600">
              {formData.status === "active" ? "Available" : "Unavailable"}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-10">
            <Button
              type="button"
              onClick={onClose}
              className="btn-base blue-normal opacity-40 w-[120px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-base blue-normal w-[120px]"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </ModalEmpty>
  );
}

export default AdminCreateNewCouponForm;
