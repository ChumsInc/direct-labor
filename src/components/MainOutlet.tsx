import AlertList from "./alerts/AlertList";
import MainNav from "./MainNav";
import {Outlet} from "react-router";
import VersionInfo from "../ducks/version/VersionInfo";
import styled from "@emotion/styled";
import {Stack} from "react-bootstrap";

const MainOutletContainer = styled.div`
    @media (prefers-color-scheme: dark) {
        .text-secondary {
            --bs-secondary-rgb: 175, 185, 194;
        }

        .btn-outline-secondary {
            --bs-btn-border-color: #9098a0;
            --bs-btn-color: #9098a0;
            --bs-btn-hover-border-color: #9098a0;
            --bs-btn-active-bg: #9098a0;
            --bs-btn-active-border-color: #9098a0;
            --bs-btn-disabled-color: #9098a0;
            --bs-btn-disabled-bg: transparent;
            --bs-btn-disabled-border-color: #9098a0;
        }
    }
`
const MainOutlet = () => {

    return (
        <MainOutletContainer>
            <Stack direction="horizontal" gap={3} className="align-items-start">
                <MainNav />
                <div>
                    <AlertList />
                    <Outlet />
                    <VersionInfo />
                </div>
            </Stack>
        </MainOutletContainer>
    )
}

export default MainOutlet;
