import { useSpring, animated } from '@react-spring/web'

const roles = [
  '👨‍💻 Software Developer',
  '💻 Frontend Engineer',
  '🧑‍🔧 Full Stack Developer',
  '🎨 UI/UX Designer',
  '🧪 Software Tester'
]

const FloatingRoles = () => {
  const animation = useSpring({
    from: { transform: 'translateY(0%)' },
    to: async (next) => {
      while (1) {
        await next({ transform: 'translateY(-100%)' });
        await next({ transform: 'translateY(0%)' });
      }
    },
    config: { duration: 10000 },
    loop: true,
  })

  return (
    <div className="w-full overflow-hidden h-12 sm:h-14 relative mb-10">
      <animated.div style={animation} className="absolute w-full">
        <div className="flex flex-col gap-3">
          {roles.map((role, index) => (
            <div
              key={index}
              className="text-center text-base sm:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 tracking-wide"
            >
              {role}
            </div>
          ))}
        </div>
      </animated.div>
    </div>
  )
}
export default FloatingRoles;