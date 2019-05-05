import React, { Component } from 'react'
import { ApolloProvider } from 'react-apollo'
import { Query } from 'react-apollo'
import client from './client'
import { SERACH_REPOSITORY } from './graphql'

const DEFAULT_STATE = {
  first: 5,
  after: null,
  last: null,
  before: null,
  query: "graphql"
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = DEFAULT_STATE

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event){
    this.setState({
      ...DEFAULT_STATE,
      query: event.target.value
    })
  }

  handleSubmit(event){
    event.preventDefault()
  }

  render (){
    const { query, first, last, before, after } = this.state
    console.log({query})
    
    return (      
      <ApolloProvider client={client}>
        <form onSubmit={this.handleSubmit}>
          <input value={query} onChange={this.handleChange}></input>
        </form>
        <Query
          query={SERACH_REPOSITORY}
          variables={{ query, first, last, before, after }}>
        {
          ({ loading, error, data }) => {
            if (loading) return 'Loading...'
            if (error) return `Error! ${error.message}`
  
            console.log({data})
            return <div></div>
          }
        }
        </Query>
      </ApolloProvider>
    )
  }
}

export default App
