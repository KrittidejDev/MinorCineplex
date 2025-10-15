import { useState } from "react";
import { Button } from "../ui/button";
import AddRoundLight from "../Icons/AddRoundLight";
import TableCard from "../Cards/TableCard";
import AdminCreateNewCouponForm from "../Forms/AdminCreateNewCouponsForm";
import { APICoupon } from "../../types/coupon";
import { useEffect } from "react";
import { userService } from "@/config/userServices";

function AdminCouponWidget() {
  const [isShowCreateModal, setIsShowCreateModal] = useState(false);
  const [coupons, setCoupons] = useState<APICoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const couponColumns = [
    { key: "code", label: "Code", align: "left" as const },
    { key: "title_en", label: "Coupon Name", align: "center" as const },
    { key: "discount_type", label: "Catagory", align: "center" as const },
    { key: "discount_value", label: "Discount", align: "center" as const },
    { key: "end_date", label: "Validity", align: "center" as const },
    { key: "usage_limit", label: "Usage", align: "center" as const },
    { key: "status", label: "Status", align: "center" as const },
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchCoupons = async () => {
      try {
        const res = (await userService.GET_COUPON()) as {
          coupons: APICoupon[];
        };
        console.log("res", res);
        if (isMounted) setCoupons(res.coupons || []);
      } catch (err) {
        console.error("❌ Failed to fetch coupons:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCoupons();
    return () => {
      isMounted = false;
    };
  }, []);

  const couponActions = [
    {
      onView: () => console.log("View Movie 1"),
      onEdit: () => console.log("Edit Movie 1"),
      onDelete: () => console.log("Delete Movie 1"),
    },
    {
      onView: () => console.log("View Movie 2"),
      onEdit: () => console.log("Edit Movie 2"),
      onDelete: () => console.log("Delete Movie 2"),
    },
  ];

  if (loading) {
    return <p className="text-white text-center">Loading coupons...</p>;
  }

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-f-56 text-gray-g63f">Coupon</h1>

          <Button
            className="btn-base blue-normal text-fm-16 font-bold px-4 py-3 gap-2.5"
            onClick={() => setIsShowCreateModal(true)}
          >
            <AddRoundLight width={24} height={24} color={"#FFFFFF"} />
            Create Coupon
          </Button>
        </div>
        <TableCard
          columns={couponColumns}
          data={coupons.map((c) => ({ ...c }) as Record<string, unknown>)}
          actions={couponActions}
        />
      </div>
      <AdminCreateNewCouponForm
        isShowModal={isShowCreateModal}
        onClose={() => setIsShowCreateModal(false)}
      />
    </>
  );
}

export default AdminCouponWidget;
