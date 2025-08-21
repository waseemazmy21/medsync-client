import { Heart } from "lucide-react"

function Logo() {
  return (
    <div className="flex items-center space-x-2 ">
      <div className="flex items-center gap-2">
        <Heart className="h-8 w-8 text-primary" />
        <span className="text-2xl font-bold text-gray-900 dark:text-white">MedSync</span>
      </div>
    </div>
  )
}

export default Logo
