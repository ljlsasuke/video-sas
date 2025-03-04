import React from 'react'

export interface SasIconProps {
  name: string
  prefix?: string
  color?: string
  className?: string
  width?: string | number
  height?: string | number
}

const SasIcon: React.FC<SasIconProps> = ({
  name,
  prefix = 'icon',
  color = '',
  className = '',
  width = '20',
  height = '20',
}) => {
  const symbolId = `#${prefix}-${name}`

  return (
    <svg
      className={`sas-icon ${className}`}
      aria-hidden="true"
      width={width}
      height={height}
    >
      <use href={symbolId} fill={color} />
    </svg>
  )
}

export default SasIcon
