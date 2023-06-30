import styled from 'styled-components'

export const NavbarContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  column-gap: 10px;
  background-color: orangered;
  height: 50px;
  padding-right: 10px;
`
export const StyledAnchor = styled.a`
  text-decoration: none;

  a:hover {
    text-decoration: underline;
  }
`