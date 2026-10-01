// Base glass surface. Layers: distortion + blur, tint, specular rim, content.
// The highlight follows the pointer via the --mx / --my CSS variables.
function Glass({ as: Tag = 'div', className = '', children, ...props }) {
  function handlePointerMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  return (
    <Tag
      className={`glass ${className}`}
      onPointerMove={handlePointerMove}
      {...props}
    >
      <span className="glass-effect" aria-hidden="true" />
      <span className="glass-tint" aria-hidden="true" />
      <span className="glass-shine" aria-hidden="true" />
      <span className="glass-content">{children}</span>
    </Tag>
  )
}

export default Glass
