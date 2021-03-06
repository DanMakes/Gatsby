import React, { useEffect } from "react"
import { graphql as gql } from "gatsby"
import MainLayout from "../components/layouts/main/MainLayout"
import postStyles from "../assets/post.module.scss"
import ReactMarkdown from "react-markdown"
import Prism from "prismjs"
import Disqus from "disqus-react"
import { Link } from "gatsby"
import { Helmet } from "react-helmet"
import { AiOutlineTwitter } from "react-icons/ai"
import { TiSocialFacebook } from "react-icons/ti"
import SEO from "../components/SEO"
import moment from "moment"

export const query = gql`
  query GetPost($slug: String!) {
    restApiPostsList(slug: { eq: $slug }) {
      slug
      created_at
      tags {
        id
        tag {
          color
          name
        }
      }
      id
      content
      title
      author {
        profile {
          first_name
          last_name
          profile_photo
        }
      }
    }
  }
`

const getClosePost = props => {
  let {
    pageContext: { previousPost, nextPost },
  } = props

  console.log(previousPost)
  let previousPostMarkup = "",
    nextPostMarkup = ""
  if (previousPost) {
    previousPostMarkup = `
    <div class="flex-grow-1 text-left">←<br/>
    <a href='/${previousPost.node.slug}' class="black-link">${previousPost.node.title}</a>
    </div>
    `
  }

  if (nextPost) {
    nextPostMarkup = `
    <div class="flex-grow-1 text-right">→<br/>
    <a href=
      '/${nextPost.node.slug}' class="black-link">${nextPost.node.title}</a>
    </div>
    `
  }

  return previousPostMarkup + nextPostMarkup
}
const Post = props => {
  const { data } = props

  useEffect(() => {
    Prism.highlightAll()
  })
  const disqusShortname = "olayemiiblog" //found in your Disqus.com dashboard
  const disqusConfig = {
    identifier: data.restApiPostsList.id, //this.props.uniqueId
    title: data.restApiPostsList.title, //this.props.title
  }
  return (
    <MainLayout>
      <Helmet
        title={`TheNoobCoder | ${data.restApiPostsList.title}`}
        defer={false}
      />
      <SEO title={`TheNoobCoder | ${data.restApiPostsList.title}`} />
      <div className={postStyles.postBody}>
        <article className={postStyles.articleMain}>
          <h1 className={postStyles.articleTitle}>
            {data.restApiPostsList.title}
          </h1>
          <div className={postStyles.articleMeta}>
            <div className={postStyles.metaFlex}>
              <span className={postStyles.postDate}>
                {moment(data.created_at).format("MMMM DD, YYYY")} by OLayemii
              </span>
            </div>
          </div>
          <div className={postStyles.articleMainBody}>
            <ReactMarkdown source={data.restApiPostsList.content} />
          </div>
          {data.restApiPostsList.tags.length ? (
            <div className={postStyles.articleTags}>
              <div className={postStyles.tag}>TAGGED IN</div>
              <ul>
                {data.restApiPostsList.tags.map(tag => (
                  <Link
                    key={tag.tag.name}
                    to={`/tag/${tag.tag.name.toLowerCase()}`}
                  >
                    <li>{tag.tag.name}</li>
                  </Link>
                ))}{" "}
              </ul>
            </div>
          ) : null}
          <div
            className="dflex related-posts"
            dangerouslySetInnerHTML={{ __html: getClosePost(props) }}
          ></div>
          <div className={postStyles.disqusWrapper}>
            <Disqus.DiscussionEmbed
              shortname={disqusShortname}
              config={disqusConfig}
            />
          </div>
        </article>
        <aside className={postStyles.articleAside}>
          <div className={postStyles.credits}></div>
          <div className="social-share">
            <h3>Share this article</h3>
            <a
              href={`https://twitter.com/share?url=${props.location.href}`}
              className="twitter-share social-button"
            >
              <AiOutlineTwitter />
              Tweet
            </a>
            <a
              href={`https://facebook.com/sharer.php?u=${props.location.href}`}
              className="facebook-share social-button"
            >
              <TiSocialFacebook />
              Share
            </a>
          </div>
        </aside>
      </div>
    </MainLayout>
  )
}

export default Post
