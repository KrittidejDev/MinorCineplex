import { useState, useEffect, useMemo } from 'react'
import { Button } from '../ui/button'
import AddRoundLight from '../Icons/AddRoundLight'
import TableCard from '../Cards/TableCard'
import AdminCreateNewCouponForm from '../Forms/AdminCreateNewCouponsForm'
import AdminEditNewCouponForm from '../Forms/AdminEditNewCouponsForm'
import { APICoupon } from '../../types/coupon'
import { userService } from '@/config/userServices'
import AdminSearchBar from '../Inputs/AdminSearchBar'
import axios from 'axios'

function AdminCouponWidget() {
  const [isShowCreateModal, setIsShowCreateModal] = useState(false)
  const [isShowEditModal, setIsShowEditModal] = useState(false)
  const [selectedCouponId, setSelectedCouponId] = useState<string>('')
  const [coupons, setCoupons] = useState<APICoupon[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const couponColumns = [
    { key: 'code', label: 'Code', align: 'left' as const },
    { key: 'title', label: 'Coupon Name', align: 'center' as const },
    { key: 'discount_type', label: 'Category', align: 'center' as const },
    { key: 'discount_value', label: 'Discount', align: 'center' as const },
    { key: 'end_date', label: 'Validity', align: 'center' as const },
    { key: 'usage_limit', label: 'Usage', align: 'center' as const },
    { key: 'status', label: 'Status', align: 'center' as const },
  ]

  // Fetch coupons
  const fetchCoupons = async () => {
    try {
      setLoading(true)
      const res = (await userService.GET_COUPON()) as {
        coupons: APICoupon[]
      }
      console.log('res', res)
      setCoupons(res.coupons || [])
    } catch (err) {
      console.error('❌ Failed to fetch coupons:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  // Filter coupons based on search term
  const filteredCoupons = useMemo(() => {
    if (!searchTerm.trim()) return coupons

    const search = searchTerm.toLowerCase()
    return coupons.filter((coupon) => {
      // Search in code
      if (coupon.code?.toLowerCase().includes(search)) return true

      // Search in slug
      if (coupon.slug?.toLowerCase().includes(search)) return true

      // Search in translations
      if (coupon.translations) {
        const enName = coupon.translations.en?.name?.toLowerCase() || ''
        const thName = coupon.translations.th?.name?.toLowerCase() || ''
        if (enName.includes(search) || thName.includes(search)) return true
      }

      return false
    })
  }, [coupons, searchTerm])

  // Transform data for table display
  const tableData = useMemo(() => {
    return filteredCoupons.map((coupon) => ({
      ...coupon,
      title: coupon.translations?.en?.name || coupon.translations?.th?.name || 'No title',
      discount_value: coupon.discount_type === 'BUY_X_GET_Y' 
        ? `Buy ${coupon.buy_quantity} Get ${coupon.get_quantity}`
        : coupon.discount_type === 'GIFT'
          ? `Gift: ${coupon.gift_type}`
          : coupon.discount_value 
            ? `${coupon.discount_value}${coupon.discount_type === 'PERCENTAGE' ? '%' : ' THB'}`
            : '-',
      end_date: coupon.end_date 
        ? new Date(coupon.end_date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
        : '-',
      usage_limit: coupon.usage_limit 
        ? `${coupon.used_count}/${coupon.usage_limit}`
        : `${coupon.used_count}/∞`,
    })) as Record<string, unknown>[]
  }, [filteredCoupons])

  // Handle Edit
  const handleEdit = (couponId: string) => {
    console.log('Edit coupon:', couponId)
    setSelectedCouponId(couponId)
    setIsShowEditModal(true)
  }

  // Handle Delete
  const handleDelete = async (couponId: string) => {
    const coupon = coupons.find((c) => c.id === couponId)
    const couponName = coupon?.translations?.en?.name || coupon?.code || 'this coupon'

    // Confirm before delete
    const confirmed = window.confirm(
      `Are you sure you want to delete "${couponName}"?\n\nThis action cannot be undone.`
    )

    if (!confirmed) return

    try {
      await axios.delete(`/api/coupons/${couponId}`)
      alert('✅ Coupon deleted successfully!')
      
      // Refresh coupon list
      await fetchCoupons()
    } catch (err) {
      console.error('❌ Failed to delete coupon:', err)
      if (axios.isAxiosError(err)) {
        const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message
        alert(`❌ Failed to delete coupon: ${errorMsg}`)
      } else {
        alert('❌ Failed to delete coupon')
      }
    }
  }

  // Handle Close Edit Modal
  const handleCloseEditModal = () => {
    setIsShowEditModal(false)
    setSelectedCouponId('')
    // Refresh data after edit
    fetchCoupons()
  }

  // Handle Close Create Modal
  const handleCloseCreateModal = () => {
    setIsShowCreateModal(false)
    // Refresh data after create
    fetchCoupons()
  }

  // Actions for each coupon
  const couponActions = useMemo(() => {
    return filteredCoupons.map((coupon) => ({
      onView: () => console.log('View coupon:', coupon.id),
      onEdit: () => handleEdit(coupon.id),
      onDelete: () => handleDelete(coupon.id),
    }))
  }, [filteredCoupons])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-white text-lg animate-pulse">Loading coupons...</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-5 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-gray-g63f">
            Coupon
          </h1>

          <Button
            className="btn-base blue-normal cursor-pointer text-sm sm:text-base font-bold px-4 py-3 gap-2.5 w-full sm:w-auto"
            onClick={() => setIsShowCreateModal(true)}
          >
            <AddRoundLight width={24} height={24} color={'#FFFFFF'} />
            Create Coupon
          </Button>
        </div>

        {/* Search Bar */}
        <div className="w-full px-0 sm:px-4 md:px-8 lg:px-[70px] mt-4 sm:mt-6 lg:mt-8">
          <div className="w-full">
            <AdminSearchBar
              placeholder="Search by code, title, or slug"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Results Count */}
        {searchTerm && (
          <div className="px-0 sm:px-4 md:px-8 lg:px-[70px]">
            <p className="text-gray-400 text-sm">
              Found {filteredCoupons.length} coupon{filteredCoupons.length !== 1 ? 's' : ''}
              {filteredCoupons.length === 0 && ' - Try a different search term'}
            </p>
          </div>
        )}

        {/* Table - Responsive */}
        <div className="mt-5 overflow-x-auto">
          {filteredCoupons.length > 0 ? (
            <TableCard
              columns={couponColumns}
              data={tableData}
              actions={couponActions}
            />
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[300px] bg-gray-900 rounded-lg">
              <p className="text-gray-400 text-lg mb-2">No coupons found</p>
              {searchTerm && (
                <p className="text-gray-500 text-sm">
                  Try adjusting your search term
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <AdminCreateNewCouponForm
        isShowModal={isShowCreateModal}
        onClose={handleCloseCreateModal}
      />

      {/* Edit Modal */}
      {selectedCouponId && (
        <AdminEditNewCouponForm
          isShowModal={isShowEditModal}
          onClose={handleCloseEditModal}
          couponId={selectedCouponId}
        />
      )}
    </>
  )
}

export default AdminCouponWidget