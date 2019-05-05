import React, { Component } from 'react'
import { Query, Mutation, ApolloProvider } from 'react-apollo'
import client from './client'
import { ADD_STAR, SERACH_REPOSITORY } from './graphql'

const StarButton = props => {
  const node = props.node
  const totalCount = node.stargazers.totalCount
  const viewerHasStarred = node.viewerHasStarred
  const starCount = totalCount === 1 ? "1 star" : `${totalCount} stars`
  const StarStatus = ({addStar}) => {
    return (
      <button
        onClick = {
          () => addStar({
              variables: { input: {starrableId: node.id }}
            })
        }
      >
        {starCount} | {viewerHasStarred ? 'starred' : '-'}
      </button>
    )
  }

  return (
    <Mutation mutation={ADD_STAR}>
      {
        addStar => <StarStatus addStar={addStar}></StarStatus>
      }
    </Mutation>
  )
}

const PER_PAGE = 5
const DEFAULT_STATE = {
  first: PER_PAGE,
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

  goPrevious(search){
    this.setState({
      first: null,
      after: null,
      last: PER_PAGE,
      before: search.pageInfo.startCursor
    })
  }

  goNext(search){
    this.setState({
      first: PER_PAGE,
      after: search.pageInfo.endCursor,
      last: null,
      before: null
    })
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

            const search = data.search
            const repositoryCount = search.repositoryCount
            const repositoryUnit = repositoryCount === 1 ? 'Repository' : 'Repositories'
            const title = `GitHub Repositories Search Results - ${repositoryCount} ${repositoryUnit}`
            return (
              <React.Fragment>
                <h2>{title}</h2>
                <ul>
                  {
                    search.edges.map(edge => {
                      const node = edge.node
                      return (
                        <li key={node.id}>
                          <a href={node.url} target="_blank" rel="noreferrer noopener">{node.name}</a>
                          &nbsp;
                          <StarButton node={node}>

                          </StarButton>
                        </li>
                      )
                    }) 
                  }
                </ul>

                {
                  search.pageInfo.hasPreviousPage === true ?
                  <button
                    onClick={this.goPrevious.bind(this, search)}
                  >
                    Previous
                  </button>
                  : null
                }

                {
                  search.pageInfo.hasNextPage === true ?
                  <button
                    onClick={this.goNext.bind(this, search)}
                  >
                    Next
                  </button>
                  : null
                }
              </React.Fragment>
            )
          }
        }
        </Query>
      </ApolloProvider>
    )
  }
}

export default App
