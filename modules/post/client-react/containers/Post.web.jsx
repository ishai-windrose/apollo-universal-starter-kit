import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';
import { PLATFORM } from '@gqlapp/core-common';

import PostList from '../components/PostList';

import POSTS_QUERY from '../graphql/PostsQuery.graphql';
import POSTS_SUBSCRIPTION from '../graphql/PostsSubscription.graphql';
import DELETE_POST from '../graphql/DeletePost.graphql';
import settings from '../../../../settings';

const limit =
  PLATFORM === 'web' || PLATFORM === 'server'
    ? settings.pagination.web.itemsNumber
    : settings.pagination.mobile.itemsNumber;

export const onAddPost = (prev, node) => {
  // ignore if duplicate
  if (prev.posts.edges.some(post => node.id === post.cursor)) {
    return update(prev, {
      posts: {
        totalCount: {
          $set: prev.posts.totalCount - 1
        },
        edges: {
          $set: prev.posts.edges
        }
      }
    });
  }

  const filteredPosts = prev.posts.edges.filter(post => post.node.id !== null);

  const edge = {
    cursor: node.id,
    node: node,
    __typename: 'PostEdges'
  };

  return update(prev, {
    posts: {
      totalCount: {
        $set: prev.posts.totalCount + 1
      },
      edges: {
        $set: [edge, ...filteredPosts]
      }
    }
  });
};

const onDeletePost = (prev, id) => {
  const index = prev.posts.edges.findIndex(x => x.node.id === id);

  // ignore if not found
  if (index < 0) {
    return prev;
  }

  return update(prev, {
    posts: {
      totalCount: {
        $set: prev.posts.totalCount - 1
      },
      edges: {
        $splice: [[index, 1]]
      }
    }
  });
};

const subscribeToPostList = (subscribeToMore, endCursor) =>
  subscribeToMore({
    document: POSTS_SUBSCRIPTION,
    variables: { endCursor },
    updateQuery: (
      prev,
      {
        subscriptionData: {
          data: {
            postsUpdated: { mutation, node }
          }
        }
      }
    ) => {
      let newResult = prev;

      if (mutation === 'CREATED') {
        newResult = onAddPost(prev, node);
      } else if (mutation === 'DELETED') {
        newResult = onDeletePost(prev, node.id);
      }

      return newResult;
    }
  });

const Post = props => {
  useEffect(() => {
    if (props.posts) {
      const {
        posts,
        posts: {
          pageInfo: { endCursor: propsEndCursor }
        }
      } = props;
      const endCursor = posts ? propsEndCursor : 0;
      const subscribe = subscribeToPostList(props.subscribeToMore, endCursor);
      return () => subscribe();
    }
  });

  return <PostList {...props} />;
};

Post.propTypes = {
  loading: PropTypes.bool.isRequired,
  posts: PropTypes.object,
  subscribeToMore: PropTypes.func.isRequired
};

export default compose(
  graphql(POSTS_QUERY, {
    options: () => {
      return {
        variables: { limit: limit, after: 0 },
        fetchPolicy: 'network-only'
      };
    },
    props: ({ data }) => {
      const { loading, error, posts, fetchMore, subscribeToMore } = data;
      const loadData = (after, dataDelivery) => {
        return fetchMore({
          variables: {
            after: after
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const totalCount = fetchMoreResult.posts.totalCount;
            const newEdges = fetchMoreResult.posts.edges;
            const pageInfo = fetchMoreResult.posts.pageInfo;
            const displayedEdges = dataDelivery === 'add' ? [...previousResult.posts.edges, ...newEdges] : newEdges;

            return {
              // By returning `cursor` here, we update the `fetchMore` function
              // to the new cursor.
              posts: {
                totalCount,
                edges: displayedEdges,
                pageInfo,
                __typename: 'Posts'
              }
            };
          }
        });
      };
      if (error) throw new Error(error);
      return { loading, posts, subscribeToMore, loadData };
    }
  }),
  graphql(DELETE_POST, {
    props: ({ mutate }) => ({
      deletePost: id => {
        mutate({
          variables: { id },
          optimisticResponse: {
            __typename: 'Mutation',
            deletePost: {
              id: id,
              __typename: 'Post'
            }
          },

          update: (cache, { data: { deletePost } }) => {
            // Get previous posts from cache
            const prevPosts = cache.readQuery({
              query: POSTS_QUERY,
              variables: {
                limit,
                after: 0
              }
            });

            const newListPosts = onDeletePost(prevPosts, deletePost.id);

            // Write posts to cache
            cache.writeQuery({
              query: POSTS_QUERY,
              variables: {
                limit,
                after: 0
              },
              data: {
                posts: {
                  ...newListPosts.posts,
                  __typename: 'Posts'
                }
              }
            });
          }
        });
      }
    })
  })
)(Post);