import Glass from './Glass.jsx'

function GlassButton({ className = '', type = 'button', ...props }) {
  return (
    <Glass as="button" type={type} className={`glass-button ${className}`} {...props} />
  )
}

export default GlassButton
