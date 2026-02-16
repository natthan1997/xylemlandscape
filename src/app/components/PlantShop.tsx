import { useState } from 'react';
import { ShoppingCart, Search, Filter, Plus, Minus, X, Check, Leaf, Star, Heart } from 'lucide-react';

// Mock Plant Data
const PLANTS = [
  {
    id: 1,
    name: 'ต้นมอนสเตอร่า',
    scientificName: 'Monstera Deliciosa',
    price: 450,
    originalPrice: 650,
    category: 'ไม้ประดับ',
    image: 'https://images.unsplash.com/photo-1614594895304-fe7116b781fa?w=500',
    description: 'ต้นไม้ฟอกอากาศยอดนิยม ใบใหญ่สวยงาม เหมาะกับห้องแอร์',
    care: 'ง่าย',
    light: 'กลาง-น้อย',
    water: 'สัปดาห์ละ 1-2 ครั้ง',
    size: 'กระถาง 6 นิ้ว',
    stock: 15,
    rating: 4.8,
    reviews: 124
  },
  {
    id: 2,
    name: 'ต้นพลูด่าง',
    scientificName: 'Epipremnum Aureum',
    price: 180,
    category: 'ไม้เลื้อย',
    image: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=500',
    description: 'ไม้ฟอกอากาศ ดูแลง่าย โตเร็ว เหมาะกับมือใหม่',
    care: 'ง่ายมาก',
    light: 'น้อย-กลาง',
    water: 'สัปดาห์ละ 1 ครั้ง',
    size: 'กระถางแขวน 5 นิ้ว',
    stock: 30,
    rating: 4.9,
    reviews: 256
  },
  {
    id: 3,
    name: 'ต้นเบญจมาศ',
    scientificName: 'Chrysanthemum',
    price: 120,
    category: 'ไม้ดอก',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500',
    description: 'ดอกสีสันสดใส เหมาะสำหรับตกแต่งสวน',
    care: 'กลาง',
    light: 'มาก',
    water: 'วันละ 1 ครั้ง',
    size: 'กระถาง 4 นิ้ว',
    stock: 45,
    rating: 4.6,
    reviews: 89
  },
  {
    id: 4,
    name: 'ต้นหางนกยูง',
    scientificName: 'Sansevieria',
    price: 250,
    category: 'ไม้ประดับ',
    image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=500',
    description: 'ทนแล้ง ฟอกอากาศดี เหมาะกับออฟฟิศ',
    care: 'ง่ายมาก',
    light: 'น้อย-มาก',
    water: '2 สัปดาห์ละครั้ง',
    size: 'กระถาง 6 นิ้ว',
    stock: 20,
    rating: 4.7,
    reviews: 167
  },
  {
    id: 5,
    name: 'ต้นกระบองเพชร',
    scientificName: 'Cactus Mix',
    price: 95,
    category: 'ไม้อวบน้ำ',
    image: 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=500',
    description: 'ดูแลง่าย ไม่ต้องรดน้ำบ่อย เหมาะกับคนยุ่ง',
    care: 'ง่ายมาก',
    light: 'มาก',
    water: 'เดือนละ 1-2 ครั้ง',
    size: 'กระถาง 3 นิ้ว',
    stock: 50,
    rating: 4.5,
    reviews: 203
  },
  {
    id: 6,
    name: 'ต้นฟิโลเดนดรอน',
    scientificName: 'Philodendron',
    price: 320,
    originalPrice: 420,
    category: 'ไม้ประดับ',
    image: 'https://images.unsplash.com/photo-1583953427525-531e03ca2c4b?w=500',
    description: 'ใบหัวใจสวยงาม โตง่าย เหมาะตกแต่งบ้าน',
    care: 'ง่าย',
    light: 'กลาง',
    water: 'สัปดาห์ละ 1-2 ครั้ง',
    size: 'กระถาง 5 นิ้ว',
    stock: 12,
    rating: 4.8,
    reviews: 142
  },
  {
    id: 7,
    name: 'ต้นบอนสี',
    scientificName: 'Bonsai Tree',
    price: 890,
    category: 'ไม้ประดับ',
    image: 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=500',
    description: 'บอนสีมินิ เหมาะสำหรับโต๊ะทำงาน',
    care: 'กลาง',
    light: 'มาก',
    water: 'วันละ 1 ครั้ง',
    size: 'กระถางพิเศษ 8 นิ้ว',
    stock: 8,
    rating: 4.9,
    reviews: 76
  },
  {
    id: 8,
    name: 'ต้นกุหลาบ',
    scientificName: 'Rosa',
    price: 280,
    category: 'ไม้ดอก',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500',
    description: 'ดอกสวยหอม หลากหลายสี',
    care: 'กลาง',
    light: 'มาก',
    water: 'วันละ 1-2 ครั้ง',
    size: 'กระถาง 5 นิ้ว',
    stock: 25,
    rating: 4.7,
    reviews: 198
  }
];

const CATEGORIES = ['ทั้งหมด', 'ไม้ประดับ', 'ไม้ดอก', 'ไม้เลื้อย', 'ไม้อวบน้ำ'];

interface CartItem {
  plant: typeof PLANTS[0];
  quantity: number;
}

export const PlantShop = () => {
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<typeof PLANTS[0] | null>(null);

  const filteredPlants = PLANTS.filter(plant => {
    const matchCategory = selectedCategory === 'ทั้งหมด' || plant.category === selectedCategory;
    const matchSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const addToCart = (plant: typeof PLANTS[0]) => {
    const existingItem = cart.find(item => item.plant.id === plant.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.plant.id === plant.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { plant, quantity: 1 }]);
    }
  };

  const updateQuantity = (plantId: number, change: number) => {
    setCart(cart.map(item => {
      if (item.plant.id === plantId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (plantId: number) => {
    setCart(cart.filter(item => item.plant.id !== plantId));
  };

  const toggleFavorite = (plantId: number) => {
    setFavorites(prev =>
      prev.includes(plantId)
        ? prev.filter(id => id !== plantId)
        : [...prev, plantId]
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.plant.price * item.quantity), 0);

  return (
    <div className="animate-fade-in pb-20 md:pb-8 max-w-full overflow-hidden">
      {/* Header - Clean & Simple */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">ช้อปปิ้งต้นไม้</h2>
      </div>

      {/* Search & Category - Minimal */}
      <div className="mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาต้นไม้..."
            className="w-full pl-12 pr-4 py-3 bg-gray-100 border-0 rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-gray-200 text-base"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap text-sm transition ${
                selectedCategory === category
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Plant Grid - Facebook Marketplace Style */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
        {filteredPlants.map(plant => (
          <div 
            key={plant.id} 
            className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition cursor-pointer"
            onClick={() => setSelectedPlant(plant)}
          >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              <img
                src={plant.image}
                alt={plant.name}
                className="w-full h-full object-cover"
              />
              {plant.originalPrice && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                  -{Math.round((1 - plant.price / plant.originalPrice) * 100)}%
                </div>
              )}
            </div>

            {/* Content - Minimal */}
            <div className="p-3">
              <p className="text-lg font-semibold text-gray-900 mb-1">฿{plant.price}</p>
              <h3 className="text-sm text-gray-800 mb-1 line-clamp-2">{plant.name}</h3>
              <p className="text-xs text-gray-500">{plant.size}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredPlants.length === 0 && (
        <div className="text-center py-12">
          <Leaf size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">ไม่พบต้นไม้ที่ค้นหา</p>
        </div>
      )}

      {/* Floating Cart Button - Mobile */}
      {totalItems > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-20 md:bottom-6 right-4 md:right-8 bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:bg-emerald-700 transition z-40"
        >
          <div className="relative">
            <ShoppingCart size={24} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          </div>
        </button>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
            {/* Cart Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="text-emerald-600" size={24} />
                <h3 className="text-xl font-bold text-gray-900">ตะกร้าสินค้า ({totalItems})</h3>
              </div>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">ตะกร้าว่างเปล่า</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.plant.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                      <img
                        src={item.plant.image}
                        alt={item.plant.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-1">{item.plant.name}</h4>
                        <p className="text-sm text-emerald-600 font-medium mb-2">฿{item.plant.price}</p>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.plant.id, -1)}
                            className="p-1 bg-white border border-gray-200 rounded-lg hover:bg-gray-100"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.plant.id, 1)}
                            className="p-1 bg-white border border-gray-200 rounded-lg hover:bg-gray-100"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="text-right flex flex-col justify-between">
                        <button
                          onClick={() => removeFromCart(item.plant.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X size={20} />
                        </button>
                        <p className="font-bold text-gray-900">฿{item.plant.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium text-gray-700">ยอดรวม</span>
                  <span className="text-2xl font-bold text-emerald-600">฿{totalPrice}</span>
                </div>
                <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-2">
                  <Check size={20} />
                  สั่งซื้อสินค้า
                </button>
                <p className="text-xs text-center text-gray-500 mt-3">
                  🚚 จัดส่งฟรีสำหรับคำสั่งซื้อมากกว่า ฿500
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Plant Detail Modal */}
      {selectedPlant && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full md:max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
            {/* Detail Header */}
            <div className="relative">
              <img
                src={selectedPlant.image}
                alt={selectedPlant.name}
                className="w-full h-64 md:h-80 object-cover"
              />
              <button
                onClick={() => setSelectedPlant(null)}
                className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Detail Content */}
            <div className="p-6">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full mb-3">
                  {selectedPlant.category}
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedPlant.name}</h3>
                <p className="text-sm text-gray-500 italic mb-3">{selectedPlant.scientificName}</p>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">{selectedPlant.rating}</span>
                  </div>
                  <span className="text-sm text-gray-400">({selectedPlant.reviews} รีวิว)</span>
                  <span className="text-sm text-gray-400">• คงเหลือ {selectedPlant.stock} ต้น</span>
                </div>
              </div>

              <p className="text-gray-600 mb-6">{selectedPlant.description}</p>

              {/* Care Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">ระดับการดูแล</p>
                  <p className="font-medium text-gray-900">{selectedPlant.care}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">แสง</p>
                  <p className="font-medium text-gray-900">{selectedPlant.light}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">การรดน้ำ</p>
                  <p className="font-medium text-gray-900">{selectedPlant.water}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">ขนาด</p>
                  <p className="font-medium text-gray-900">{selectedPlant.size}</p>
                </div>
              </div>

              {/* Price & Add to Cart */}
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl mb-4">
                <div>
                  {selectedPlant.originalPrice && (
                    <p className="text-sm text-gray-500 line-through">฿{selectedPlant.originalPrice}</p>
                  )}
                  <p className="text-3xl font-bold text-emerald-600">฿{selectedPlant.price}</p>
                </div>
                <button
                  onClick={() => {
                    addToCart(selectedPlant);
                    setSelectedPlant(null);
                    setShowCart(true);
                  }}
                  disabled={selectedPlant.stock === 0}
                  className={`px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 ${
                    selectedPlant.stock === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  <Plus size={20} />
                  {selectedPlant.stock === 0 ? 'สินค้าหมด' : 'เพิ่มลงตะกร้า'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};