import React from 'react'

function HeadSection({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div  className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white">
      {children}
    </div>
  )
}

export default HeadSection
