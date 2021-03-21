import React from 'react'

const NewsfulContext = React.createContext()

export const NewsfulProvider = NewsfulContext.Provider
export const NewsfulConsumer = NewsfulContext.Consumer

export default NewsfulContext