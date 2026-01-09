import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Intro = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard')
    }, 9000) // 4 sec

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center">
      <video
        src="/images/intro.mp4"
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
      />
    </div>
  )
}

export default Intro
