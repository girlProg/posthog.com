import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import './Layout.css'
import ResponsiveSidebar from '../ResponsiveSidebar'
import Container from '../Container'
import ResponsiveAnchor from '../ResponsiveAnchor'
import ResponsiveTopBar from '../ResponsiveTopBar'
import MediaQuery from 'react-responsive'
import { default as AntdLayout } from 'antd/lib/layout'
import Col from 'antd/lib/col'
import { connect } from 'react-redux'
import { isSidebarHide, isAnchorHide } from '../../store/selectors'
import blogBackground from '../../images/blog-background.svg'


class Layout extends Component {
  setPostPageState = state => {
    this.props.setPostPageState(state)
  }

  render() {
    const {
      children,
      onPostPage,
      sidebarHide,
      anchorHide,
      className,
      containerStyle={},
      expandedKeys,
      isBlogPage,
      pageTitle
    } = this.props

    return (
      <StaticQuery
        query={graphql`
          query SiteTitleQuery {
            site {
              siteMetadata {
                title
              }
            }
          }
        `}
        render={data => {
          return (
            <MediaQuery maxWidth={1000}>
              {screenIsSmall => (
                <>
                  <Helmet
                    title={data.site.siteMetadata.title}
                    meta={[
                      { name: 'description', content: 'Sample' },
                      { name: 'keywords', content: 'sample, something' },
                    ]}
                  >
                    <html lang="en" />
                  </Helmet>
                  <AntdLayout theme="light" style={{ backgroundColor: '#fff', width: "100%"}}>
                    {!screenIsSmall && onPostPage ? (
                      !sidebarHide && (
                      <AntdLayout.Sider width="300" theme="light" style={{backgroundColor: '#F9F9F9'}} >
                        <ResponsiveSidebar style={{border: 'none'}}/>
                        </AntdLayout.Sider>
                      )):(
                        <div></div>
                      )}

                      <AntdLayout theme="light">
                        <AntdLayout.Header
                        style={{ 
                          backgroundColor: screenIsSmall ? '#F9F9F9' : '#fff', 
                          backgroundImage: isBlogPage && !screenIsSmall && `url(${blogBackground})`,
                          backgroundSize: '80vw',
                          height: !screenIsSmall && isBlogPage && '45vh',
                          borderBottom: onPostPage && screenIsSmall && '6px solid #C4C4C4',
                          padding: screenIsSmall && 0,
                        }}
                        theme="light"
                        >
                          <Header
                          siteTitle={data.site.siteMetadata.title}
                          sidebarDocked={!screenIsSmall}
                          sidebarHide={sidebarHide}
                          onPostPage={onPostPage}
                          screenIsSmall={screenIsSmall}
                          isBlogPage={isBlogPage}
                          theme="light"
                          />  
                          {screenIsSmall &&
                            onPostPage &&
                            (!anchorHide || !sidebarHide) && (
                                <ResponsiveTopBar />
                            )}
                          {isBlogPage && !screenIsSmall &&
                          <div style={{
                            position: 'absolute',  
                            height: '10vh', 
                            top: '30vh', 
                            width: 'calc(100% - 40vw)', 
                            color: 'white', 
                            verticalAlign: 'bottom',
                            paddingLeft: 'calc((100% - 300px) * 0.1 - 50px + 1.0875rem)'}}>

                            <h1 align="left" style={{
                              position: 'static', 
                              color: 'white',  
                              paddingLeft: 'calc((100% - 300px) * 0.1 - 50px + 1.0875rem)',
                            }} >
                              {pageTitle}
                            </h1>
                          </div>
                          }
                        </AntdLayout.Header>

                      {/* content */}
                      {!screenIsSmall && onPostPage ? (
                        <AntdLayout theme="light" style={{ backgroundColor: '#fff', width: "100%"}}>
                          <AntdLayout.Content style={{ minHeight: 280, padding: '3rem 0% 0 10%', width: '100%' }}>
                            <Container
                              sidebarDocked={!screenIsSmall}
                              onPostPage={onPostPage}
                              className={className}
                              style={{ position: 'relative' }}
                              containerStyle={containerStyle}
                            >
                              {children}
                            </Container>
                          </AntdLayout.Content>
                          
                          {/* Sidebar right */}
                          {!anchorHide && (
                            <AntdLayout.Sider
                              theme="light"
                              style={{ height: '100%', backgroundColor: '#fff' }}
                              className="rightBar"
                              
                            >
                              <ResponsiveAnchor />
                            </AntdLayout.Sider>
                          )}
                        </AntdLayout>
                      ) : (
                        <AntdLayout theme="light" style={{ backgroundColor: '#fff', width: "100%"}}>
                          <AntdLayout.Content
                            style={{
                              position: 'relative',
                              left: 0,
                              right: 0,
                              marginTop: 50,
                            }}
                          >
                            <Container
                              sidebarDocked={!screenIsSmall}
                              onPostPage={onPostPage}
                              className={className}
                              style={{ position: 'relative' }}
                              containerStyle={containerStyle}
                            >
                              {children}
                            </Container>
                          </AntdLayout.Content>
                        </AntdLayout>
                      )}
                      </AntdLayout>
                  </AntdLayout>
                  <AntdLayout>
                  <Footer />
                  </AntdLayout>
                </>
              )}
            </MediaQuery>
          )
        }}
      />
    )
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  containerStyle: PropTypes.object,
}

const mapStateToProps = state => {
  return {
    sidebarHide: isSidebarHide(state),
    anchorHide: isAnchorHide(state),
  }
}

export default connect(mapStateToProps)(Layout)
