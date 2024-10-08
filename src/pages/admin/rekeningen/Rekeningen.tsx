import { useNavigate } from "react-router-dom";
import Button from "../../../components/button/Button";
import InvoicePopup from "../../../components/invoices/popups/InvoicePopup";
import SectionTitle from "../../../components/sectionTitle/SectionTitle";
import { useAccountContext } from "../../../contexts/AccountContext";
import { usePopupContext } from "../../../contexts/PopupContext";
import useFetch from "../../../hooks/useFetch";
import FetchedDataLayout from "../../../layouts/FetchedDataLayout";
import { getInvoiceSummary } from "../../../services/invoiceService";
import Invoice, { InvoiceSummary } from "../../../types/Invoice";
import { formatCustomDate, formatDateToDate } from "../../../utils/datetimeUtil";
import "./Rekeningen.css";
import { Table } from "../../../components/table/Table";
import { Column } from "../../../components/table/Column";
import InvoiceStatisticsPopup from "../../../components/invoices/popups/InvoiceStatisticsPopup";
import StreepkesPopup from "../../../components/invoices/popups/StreepkesPopup";

const Rekeningen = () => {
    const { pending, data: invoices, error, refetch } = useFetch<InvoiceSummary[]>(getInvoiceSummary);
    const { account } = useAccountContext();
    const { registerPopup } = usePopupContext();
    const navigate = useNavigate();

    const openInvoicePopup = () => {
        registerPopup(<InvoicePopup onClose={refetch} />);
    }

    const openStatisticsPopup = () => {
        registerPopup(<InvoiceStatisticsPopup onClose={refetch} />);
    }

    const openStreepkesPopup = () => {
        registerPopup(<StreepkesPopup onClose={refetch} />);
    }

    return (
        <>
            <SectionTitle title="Rekeningen beheren">
                <p>Beheer hier de rekeningen van de leiding.</p>
                <p>Klik op een persoon om details te zien over zijn historiek.</p>
            </SectionTitle>
            {account?.role.id === 2 &&
                <div className="admin__actions">
                    <Button text="Transactie toevoegen" hover onClick={openInvoicePopup} />
                    <Button text="Streepkes" hover onClick={openStreepkesPopup} />
                    <Button text="Statistieken" hover onClick={openStatisticsPopup} customClassName="open-statistics-button"/>
                </div>
            }
            <FetchedDataLayout isPending={pending} error={error}>
                {invoices && invoices.length === 0 && (
                    <p>Geen rekeningen gevonden.</p>
                )}
                {invoices && invoices.length > 0 && (
                    <Table
                        values={invoices}
                        rows={10}
                        responsiveLayout="scroll"
                        onRowClick={account?.role.id === 2 ? (invoice) => navigate(`/admin/rekeningen/leider/${invoice.leaderId}`) : undefined}
                    >
                        <Column
                            field="firstName"
                            header="Naam"
                            body={(rowData: InvoiceSummary) => `${rowData.firstName} ${rowData.lastName}`}
                            sortable
                        />
                        <Column
                            field="totalGrossAmount"
                            header="Bedrag"
                            body={(rowData: InvoiceSummary) => `€ ${rowData.totalGrossAmount}`}
                            sortable
                            sortFunction={(a, b, sortDirection) => {
                                const valueA = a.totalGrossAmount;
                                const valueB = b.totalGrossAmount;
                                return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
                            }}
                        />
                        <Column
                            field="mostRecentInvoice.createdAt"
                            header="Recentste transactie"
                            body={(rowData: InvoiceSummary) =>
                                rowData.mostRecentInvoice
                                    ? `${formatDateToDate(rowData.mostRecentInvoice.createdAt)} - ${rowData.mostRecentInvoice.name}`
                                    : "/"
                            }
                            sortable
                            sortFunction={(a, b, sortDirection) => {
                                const valueA = a.mostRecentInvoice ? a.mostRecentInvoice.createdAt : new Date();
                                const valueB = b.mostRecentInvoice ? b.mostRecentInvoice.createdAt : new Date();
                                return sortDirection === 'asc' ? valueA.getTime() - valueB.getTime() : valueB.getTime() - valueA.getTime();
                            }
                        }/>
                    </Table>
                )}
            </FetchedDataLayout>
        </>
    );
};

export default Rekeningen;
