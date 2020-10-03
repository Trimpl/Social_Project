import * as React from 'react';
import { Container } from 'reactstrap';
import MesNotifications from './MessageNotifications/MesNotifications';
import NavMenu from './NavMenu';

export default (props: { children?: React.ReactNode }) => (
    <React.Fragment>
        <NavMenu />
        <Container>
            <main role="main" style={{ marginTop:"65px" }}>
                <MesNotifications />
                {props.children}
            </main>
        </Container>
    </React.Fragment>
);
