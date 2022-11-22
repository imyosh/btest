import React from 'react'
import './table.scss'

const addTablePadding = (ref) => {
  if (ref) {
    let hasVerticalScrollbar = ref.scrollHeight > ref.clientHeight
    if (hasVerticalScrollbar) {
      ref.style.width = 'calc(100% + 1.32rem)'
    } else {
      ref.style.width = 'calc(100% + 0.84rem)'
    }
  }
}

const items = [{
  name:
}]

const Table = ({ items, itemTemplate }) => {


  const tbodyRef = useRef(null)

  useEffect(() => {
    addTablePadding(tbodyRef.current)
  }, [items])

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp, false)
    document.addEventListener('keydown', handleKeyDown, false)
    window.addEventListener('resize', () => addTablePadding(tbodyRef.current))

    return () => {
      document.removeEventListener('keyup', handleKeyUp, false)
      document.removeEventListener('keydown', handleKeyDown, false)
      window.removeEventListener('resize', () =>
        addTablePadding(tbodyRef.current)
      )
    }
  }, [])

  return (
    <div className='table'>
      <div ref={tbodyRef} className='table__tbody'>
        {items ? (
          items.data.length > 0 ? (
            items.data.map((item, id) => <itemTemplate item={item} />)
          ) : (
            <div className='table__empty'>Empty</div>
          )
        ) : (
          <div className='table__empty'>Empty</div>
        )}
      </div>
    </div>
  )
}

export default Table
