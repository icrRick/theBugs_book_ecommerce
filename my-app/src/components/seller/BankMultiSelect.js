"use client"
import { useState, useEffect } from 'react'

const BankSearchSelect = ({ formData, handleBankChange, errors, isLoadingBanks }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredBanks, setFilteredBanks] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [banks, setBanks] = useState([])

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await fetch('https://api.vietqr.io/v2/banks')
        const { data } = await res.json()
        setBanks(data)
        setFilteredBanks(data)
      } catch (error) {
        console.error('Error fetching banks:', error)
      }
    }
    
    fetchBanks()
  }, [])

  const handleSearch = (term) => {
    setSearchTerm(term)
    const filtered = banks.filter(bank => 
      bank.shortName.toLowerCase().includes(term.toLowerCase()) ||
      bank.name.toLowerCase().includes(term.toLowerCase())
    )
    setFilteredBanks(filtered)
  }

  const handleSelectBank = (bank) => {
    handleBankChange({
      target: {
        name: "bankName",
        value: bank.shortName
      }
    })
    setSearchTerm(bank.shortName) // Hiển thị shortName khi chọn
    setIsOpen(false)
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          placeholder="Tìm kiếm ngân hàng..."
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.bankCode ? "border-red-500" : "border-gray-300"
          } ${isLoadingBanks ? "bg-gray-100" : ""}`}
          value={searchTerm}
          onChange={(e) => {
            handleSearch(e.target.value)
            setIsOpen(true)
          }}
          onClick={() => setIsOpen(!isOpen)}
          readOnly={isLoadingBanks}
        />

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border rounded-lg shadow-lg">
            {filteredBanks.length > 0 ? (
              filteredBanks.map((bank) => (
                <div
                  key={bank.bin}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center gap-2"
                  onClick={() => handleSelectBank(bank)}
                >
                  {/* Hiển thị shortName kèm tên đầy đủ trong tooltip */}
                  <span title={bank.name}>{bank.shortName}</span>
                  <span className="text-xs text-gray-500">({bank.bin})</span>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">
                {isLoadingBanks ? "Đang tải..." : "Không tìm thấy ngân hàng"}
              </div>
            )}
          </div>
        )}

        <input
          type="hidden"
          name="bankCode"
          value={formData?.bankCode || ""}
        />
      </div>

      {errors.bankCode && (
        <p className="text-red-500 text-sm mt-1">{errors.bankCode}</p>
      )}
    </div>
  )
}

export default BankSearchSelect