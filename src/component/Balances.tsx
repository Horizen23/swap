import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDeletWallet } from "../features/balance/balanceSlice";
import { selectActiveToken, addTransaction, useFidToken } from "../features/page/pageSlice";
import Transactions from "./Transactions";

export default function Balances() {
  const active = useSelector(selectActiveToken);
  let token = useFidToken(active);
  const dispatch = useDispatch();
  const DeWalletHook = useDeletWallet(dispatch)
  let [action, setaction] = useState<'Transfer' | 'Deposit' | 'CreateInvoice' | 'PayInvoice'>('Deposit')
  return (
    <div className="col-md-12 col-lg-8">
      <div className="tab-content">
        <div className="tab-pane tab-pane2 fade active show">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Balances</h5>
              <p style={{ cursor: "pointer" }} onClick={() => DeWalletHook(active)}>
                exict ()
              </p>
              <ul>
                <li className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <i className="icon ion-md-cash"></i>
                    <h2>Total Equity</h2>
                  </div>
                  <div>
                    <h3>
                      {(Math.pow(10, -token.decimals) * token.balance).toFixed(
                        8
                      )}{" "}
                      {token.symbol}
                    </h3>
                  </div>
                </li>
              </ul>
              {
                (token.symbol === 'LBTC') ?
                  <>
                    <button style={{ padding: "8px 50px !important" }} className={`btn token ${(action == 'Deposit') ? 'active' : ''}`} onClick={() => setaction('Deposit')}>Deposit</button>
                    <button style={{ padding: "8px 50px !important" }} className={`btn token ${(action == 'CreateInvoice') ? 'active' : ''}`} onClick={() => setaction('CreateInvoice')}>Create invoice</button>
                    <button style={{ padding: "8px 50px !important" }} className={`btn token ${(action == 'PayInvoice') ? 'active' : ''}`} onClick={() => setaction('PayInvoice')}>Pay invoice</button>
                  </>
                  :
                  <>
                    <button className={`btn token ${(action == 'Deposit') ? 'active' : ''}`} onClick={() => setaction('Deposit')}>Deposit</button>
                    <button className={`btn token ${(action == 'Transfer') ? 'active' : ''}`} onClick={() => setaction('Transfer')}>transfer</button>
                  </>
              }
            </div>
          </div>
          {
            {
              Deposit: <WalletDeposit address={token.address} />,
              Transfer: <WalletTransfer token={token} />,
              CreateInvoice: <WalletCreateInvoice token={token} />,
              PayInvoice: <WalletPayInvoice token={token} />
            }[action]
          }
          <Transactions />
        </div>
      </div>
    </div>
  );
}
function WalletPayInvoice({ token }: { token: any }) {
  const [invoice, setinvoice] = useState<any>('');
  const dispatch = useDispatch();
  function handleClick() {
    MHGWallet.api.payInvoice(invoice).then((response: any) => {
      setinvoice('')
      dispatch(addTransaction());
      console.log(response)

    })
  }
  return <div className="card" >
    <div className="card-body">
      <h5 className="card-title">Pay Invoice</h5>
      <div className="row wallet-address">
        <div className="col-md-9">
          <p>Deposits to this address are unlimited. Note that you may not be able to withdraw all
            of your
            funds at once if you deposit more than your daily withdrawal limit.</p>
          <div className="input-group">
            <div className="d-flex align-items-center mr-3">
              <div>Invoice</div>
            </div>
            <input value={invoice} onChange={(e) => setinvoice(e.target.value)} type="text" className="form-control" placeholder="Invoice payment hash" />
            <div className="input-group-prepend"><button onClick={() => navigator.clipboard.readText().then(clipText => setinvoice(clipText))} className=" btn btn-primary pasta">Paste</button></div>


          </div>

          <button onClick={handleClick} className="btn token active">Pay</button>
        </div>
      </div>
    </div>
  </div>

}

function WalletCreateInvoice({ token }: { token: any }) {
  const [inputAmount, setinputAmount] = useState<any>('');
  const [showInvoice, setshowInvoice] = useState<any>(false);
  const dispatch = useDispatch();

  function handleClick() {
    Swal.fire({
      title: 'confirm create invoice !?',
      html: `
          <div class="alert-mhg">
              <p> Amount : ${inputAmount} BTC</p>
              <br/>
          </div>
          `,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'confirm'
    }).then((result: any) => {
      if (result.isConfirmed) {
        MHGWallet.api.createInvoice((Math.pow(10, token.decimals) * inputAmount)).then((response: any) => {
          // setinputSeedTo('')
          setinputAmount('')
          dispatch(addTransaction());
          setshowInvoice(true);

          Swal.fire(
            {
              title: 'Payment Invoice',
              html: `
                          <div>
                          <img id="qr-code" className="qr-code img-thumbnail img-responsive" src="https://chart.googleapis.com/chart?cht=qr&chl=${response.payment_request}&chs=300x300&chld=L|0" />
                          </div><br>
                          <textarea style="width: 100%;" className="form-control" disabled cols="30" rows="6">${response.payment_request}</textarea>

                          `,

            }
          )

        })
      }
    })

  }
  return <div className="card" >
    <div className="card-body">
      <h5 className="card-title">Create Invoice</h5>
      <div className="row wallet-address">
        <div className="col-md-9">
          <p>Deposits to this address are unlimited. Note that you may not be able to withdraw all
            of your
            funds at once if you deposit more than your daily withdrawal limit.</p>
          <div className="input-group">
            <div className="d-flex align-items-center mr-3">
              <div>Amount</div>
            </div>
            <input value={inputAmount} onChange={(e) => setinputAmount(e.target.value)} type="text" className="form-control" placeholder="ex. 0.0001 , 1" />
            <div className="input-group-prepend"><button onClick={() => navigator.clipboard.readText().then(clipText => setinputAmount(clipText))} className=" btn btn-primary pasta">Paste</button></div>


          </div>

          <button onClick={handleClick} className="btn token active">Create invoice</button>
        </div>
      </div>
    </div>
  </div>

}

function WalletTransfer({ token }: { token: any }) {
  const [inputSeedTo, setinputSeedTo] = useState<any>("");
  const [inputAmount, setinputAmount] = useState<any>("");
  function handleClick() {
    Swal.fire({
      title: "confirm transaction !?",
      html: `
            <div class="alert-mhg">
                <p> Amount :${inputAmount} </p>
                <br/>
                <p>to Address: ${inputSeedTo} </p>
            </div>
            `,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "confirm",
    }).then((result: any) => {
      if (result.isConfirmed) {
        MHGWallet.api
          .trenfer(token.symbol, inputAmount, inputSeedTo)
          .then(() => {
            setinputSeedTo("");
            setinputAmount("");
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
          });
      }
    });
  }
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Wallet Transfer {token.symbol}</h5>
        <div className="row wallet-address">
          <div className="col-md-9">
            <p>
              Deposits to this address are unlimited. Note that you may not be
              able to withdraw all of your funds at once if you deposit more
              than your daily withdrawal limit.
            </p>
            <div className="input-group">
              <div className="d-flex align-items-center mr-3">
                <div>Sent To</div>
              </div>
              <input
                value={inputSeedTo}
                onChange={(e) => setinputSeedTo(e.target.value)}
                type="text"
                className="form-control"
                placeholder="ex. 0x000000000000000000000000000000"
              />
              <div className="input-group-prepend">
                <button
                  onClick={() =>
                    navigator.clipboard
                      .readText()
                      .then((clipText) => setinputSeedTo(clipText))
                  }
                  className=" btn btn-primary pasta"
                >
                  Pasta
                </button>
              </div>
            </div>
            <div className="input-group">
              <div className="d-flex align-items-center mr-3">
                <div>Amount</div>
              </div>
              <input
                value={inputAmount}
                onChange={(e) => setinputAmount(e.target.value)}
                type="text"
                className="form-control"
                placeholder="ex. 0.0001 , 1"
              />
              <div className="input-group-prepend">
                <button
                  onClick={() =>
                    navigator.clipboard
                      .readText()
                      .then((clipText) => setinputAmount(clipText))
                  }
                  className=" btn btn-primary pasta"
                >
                  Pasta
                </button>
              </div>
            </div>
            <div className="input-group">
              you balance :{" "}
              {(Math.pow(10, -token.decimals) * token.balance).toFixed(8)}
              <button
                className="ml-3 max btn"
                onClick={() =>
                  setinputAmount(
                    (Math.pow(10, -token.decimals) * token.balance).toFixed(8)
                  )
                }
              >
                max
              </button>
            </div>
            <button onClick={handleClick} className="btn token active">
              Sent transfer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function WalletDeposit({ address }: any) {
  const [copy, setcopy] = useState(false);
  const copyToClipboard = () => {
    const textField = document.createElement("textarea");
    textField.innerText = address;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
    setcopy(true);
  };
  useEffect(() => {
    let timer1 = setTimeout(() => setcopy(false), 2 * 1000);
    return () => {
      clearTimeout(timer1);
    };
  }, [copy]);
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Wallet Deposit Address</h5>
        <div className="row wallet-address">
          <div className="col-md-8">
            <p>
              Deposits to this address are unlimited. Note that you may not be
              able to withdraw all of your funds at once if you deposit more
              than your daily withdrawal limit.
            </p>
            <div className="input-group">
              <input type="text" className="form-control" value={address} onChange={() => { }} />
              <div className="input-group-prepend">
                <button
                  className={`${copy ? "active" : ""
                    } btn btn-primary copy-text`}
                  onClick={copyToClipboard}
                >
                  COPY
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div id="qr-code"></div>
            <img
              id="qr-code"
              className="qr-code img-thumbnail img-responsive"
              src={`https://chart.googleapis.com/chart?cht=qr&chl=${address}&chs=160x160&chld=L|0`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

