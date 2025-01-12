import TransactionsTable from "../components/transactionsTable/TransactionsTable";
import Hoc from "../components/UI/Hoc";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { BalanceContext } from "../contexts/balance/BalanceContext";
import { IBalanceContext } from "../contexts/balance/BalanceTypes";
import {
  getPageFromOffset,
  TRANSACTIONS_TABLE_ITEMS_PER_PAGE,
  DEFAULT_QUERY_REFRESH_INTERVAL,
  readSession,
  UPDATE_WALLET_ID_TIMEOUT,
} from "../tools";
import { GET_MEMPOOL, GET_TRANSACTIONS, GET_HOME_NEWS } from "../graphql/query";
import NewsBanner from "../components/UI/NewsBanner";
import { IWalletData } from "../types/WalletData";
import {
  ITransactionQueryResult,
  IMempoolQueryResult,
} from "../components/transactionsTable/TransactionsTypes";
import { IHomeNewsQuery } from "../types/NewsData";

interface IProps {
  sessionData: IWalletData;
}

const Overview = ({ sessionData }: IProps) => {
  const { balance } = useContext<Partial<IBalanceContext>>(BalanceContext);
  const [offset, setOffset] = useState<number>(0);
  const [walletId, setWalletId] = useState<number>(sessionData.id);
  const { data: newsData } = useQuery<IHomeNewsQuery>(GET_HOME_NEWS);
  const latestNews =
    newsData?.news_home && newsData?.news_home.length > 0
      ? newsData?.news_home[0]
      : {};
  const {
    data: transactionsData,
    loading: transactionsLoading,
    error: transactionsError,
    refetch: transactionsRefetch,
    stopPolling: transactionStopPolling,
    startPolling: transactionStartPolling,
  } = useQuery<ITransactionQueryResult>(GET_TRANSACTIONS, {
    variables: { user: walletId, offset },
    fetchPolicy: "network-only",
    skip: !walletId,
    pollInterval: DEFAULT_QUERY_REFRESH_INTERVAL,
  });
  const {
    data: mempoolData,
    loading: mempoolLoading,
    refetch: mempoolRefetch,
    stopPolling: mempoolStopPolling,
    startPolling: mempoolStartPolling,
  } = useQuery<IMempoolQueryResult>(GET_MEMPOOL, {
    variables: { publicKey: sessionData.address },
    skip: !sessionData.address,
    fetchPolicy: "network-only",
    pollInterval: DEFAULT_QUERY_REFRESH_INTERVAL,
  });

  /**
   * Read the wallet id from the session data every 10 seconds until a valid id is retrieved
   */
  useEffect(() => {
    const timerCheck = setInterval(
      () => readWalletData(),
      UPDATE_WALLET_ID_TIMEOUT
    );
    if (walletId !== -1) {
      clearInterval(timerCheck);
    }
    return () => {
      clearInterval(timerCheck);
    };
  });

  /**
   * Read session data and set the wallet id in the component state
   */
  const readWalletData = async () => {
    const wallet = await readSession();
    if (wallet.id !== -1) {
      setWalletId(wallet.id);
    }
  };

  /**
   * Set query offset param based on selected table page
   * @param {number} page Page number
   */
  const changeOffset = (page: number) => {
    const data = (page - 1) * TRANSACTIONS_TABLE_ITEMS_PER_PAGE;
    setOffset(data);
  };

  /**
   * Restart polling interval
   * @param refetch force refetch data
   */
  const refetchData = (refetch = false) => {
    transactionStopPolling();
    mempoolStopPolling();
    if (refetch) {
      mempoolRefetch();
      transactionsRefetch();
    }
    setTimeout(() => {
      transactionStartPolling(DEFAULT_QUERY_REFRESH_INTERVAL);
      mempoolStartPolling(DEFAULT_QUERY_REFRESH_INTERVAL);
    }, 500);
  };

  return (
    <Hoc className="main-container">
      <div>
        <NewsBanner {...latestNews} />
        <TransactionsTable
          transactions={transactionsData}
          mempool={mempoolData}
          error={transactionsError}
          loading={transactionsLoading || mempoolLoading}
          balance={+(balance?.total || 0)}
          setOffset={changeOffset}
          page={getPageFromOffset(offset)}
          userId={walletId}
          userAddress={sessionData.address}
          refetchData={refetchData}
        />
      </div>
    </Hoc>
  );
};

export default Overview;
