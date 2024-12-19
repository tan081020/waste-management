import React from 'react'

const VoucherInfor = (
    voucherId:any
) => {
    
    console.log(voucherId);
    
  return (
    <div className="mt-5">
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-[400px]">
      <h3 className="text-2xl font-semibold text-gray-800 mb-2">{voucherId.voucher.name}</h3>
      <p className="text-base text-gray-600 mb-3">{voucherId.voucher.content}</p>
      <p className="text-base text-gray-600 mb-3">
        <strong className="font-semibold text-gray-800">Mã thẻ:</strong> {voucherId.voucher.cardCode}
      </p>
      <p className="text-base text-gray-600 mb-3">
        <strong className="font-semibold text-gray-800">Nhà cung cấp:</strong> {voucherId.voucher.type}
      </p>
    </div>
  </div>
  
  )
}

export default VoucherInfor
