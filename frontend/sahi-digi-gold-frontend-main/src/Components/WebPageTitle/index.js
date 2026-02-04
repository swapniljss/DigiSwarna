import React, { Fragment, useEffect } from "react";

const WebPageTitle = ({ title }) => {

    useEffect(() => {
        document.title = title;
    }, [title]);

    return <Fragment />;
};

export default WebPageTitle;