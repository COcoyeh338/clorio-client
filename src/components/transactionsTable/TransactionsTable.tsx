import { Table } from "react-bootstrap";
import Spinner from "../UI/Spinner";
import { getTotalPages } from "../../tools/utils";
import { useQuery } from "@apollo/client";
import Pagination from "../UI/pagination/Pagination";
import ReactTooltip from "react-tooltip";
import { GET_BLACKLIST, GET_TRANSACTIONS_TOTAL } from "../../graphql/query";
import {
  ITransactionRowData,
  ITransactionTableProps,
  ITransactionTotalQueryResult,
} from "./TransactionsTypes";
import TransactionRow from "./TransactionRow";
import TransactionsTableError from "./TransactionsTableError";
import {
  mempoolQueryRowToTableRow,
  transactionQueryRowToTableRow,
} from "./TransactionsHelper";
import WalletCreationTransaction from "./WalletCreationTransaction";
import RefetchTransactions from "./RefetchTransactions";
import { Blacklist } from "../../types/Blacklist";

const TransactionsTable = ({
  transactions,
  error,
  mempool,
  loading,
  userId,
  userAddress,
  page,
  setOffset,
  balance,
  refetchData,
}: ITransactionTableProps) => {
  const { data: totalData } = useQuery<ITransactionTotalQueryResult>(
    GET_TRANSACTIONS_TOTAL,
    {
      variables: { user: userId },
      skip: !userId,
      fetchPolicy: "network-only",
    }
  );

  const { data: blacklist } = useQuery<Blacklist>(GET_BLACKLIST, {
    fetchPolicy: "network-only",
  });

  if (
    !loading &&
    (error || !transactions || transactions.user_commands.length === 0)
  ) {
    return TransactionsTableError(balance, error, refetchData);
  }

  /**
   * Render table header labels
   * @returns HTMLElement
   */
  const renderTableHeader = () => {
    return (
      <tr className="th-background">
        <th className="th-first-item"></th>
        <th>ID</th>
        <th>Date</th>
        <th>Sender</th>
        <th>Recipient</th>
        <th className="th-last-item">Amount</th>
      </tr>
    );
  };

  /**
   * Render table body content
   * @returns HTMLElement
   */
  const renderTableBody = () => {
    return (
      <tbody>
        {mempool?.mempool?.map((row, index) => {
          const rowData: ITransactionRowData = mempoolQueryRowToTableRow(row);
          return TransactionRow(
            rowData,
            index,
            userAddress,
            blacklist?.blacklistedAddresses || [],
            true
          );
        })}
        {transactions?.user_commands?.map((row, index) => {
          const rowData: ITransactionRowData = transactionQueryRowToTableRow(
            row
          );
          return TransactionRow(
            rowData,
            index,
            userAddress,
            blacklist?.blacklistedAddresses || [],
            false
          );
        })}
        {lastTransaction()}
      </tbody>
    );
  };

  /**
   * If the last page of the table is rendered return an additional transaction row for the wallet creation
   * @returns HTMLElement
   */
  const lastTransaction = () => {
    const totalRows = totalData?.user_commands_aggregate?.aggregate?.count || 0;
    const isLastPage = +page === +getTotalPages(totalRows);
    if (isLastPage) {
      return WalletCreationTransaction(totalRows + 1);
    }
  };

  return (
    <div className="block-container">
      <div>
        <Spinner className={"full-width"} show={loading}>
          <div id="transaction-table">
            <RefetchTransactions refetch={refetchData} />
            <ReactTooltip multiline={true} />
            <Table
              className="animate__animated animate__fadeIn"
              id="rwd-table-large"
            >
              <thead>{renderTableHeader()}</thead>
              {renderTableBody()}
            </Table>
          </div>
        </Spinner>
        <Pagination
          page={page}
          setOffset={setOffset}
          total={getTotalPages(
            totalData?.user_commands_aggregate?.aggregate?.count || 0
          )}
        />
      </div>
    </div>
  );
};

export default TransactionsTable;
