import React from "react";
import DefaultLayout from "./DefaultLayout";

const PageLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <>
            <DefaultLayout>
                <div className="page__container">
                    <section className="page__section">
                        {children}
                    </section>
                </div>
            </DefaultLayout>
        </>
    );
}

export default PageLayout;