import { useState, useCallback, useEffect } from "react";

export function Calculator() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [resetNext, setResetNext] = useState(false);
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState("");

  const inputDigit = useCallback(
    (digit: string) => {
      if (resetNext) {
        setDisplay(digit);
        setResetNext(false);
      } else {
        setDisplay(display === "0" ? digit : display + digit);
      }
    },
    [display, resetNext],
  );

  const inputDecimal = useCallback(() => {
    if (resetNext) {
      setDisplay("0.");
      setResetNext(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  }, [display, resetNext]);

  const clear = useCallback(() => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setResetNext(false);
    setHistory("");
  }, []);

  const performOperation = useCallback(
    (nextOp: string) => {
      const current = parseFloat(display);
      if (previousValue !== null && operation && !resetNext) {
        let result: number;
        switch (operation) {
          case "+":
            result = previousValue + current;
            break;
          case "-":
            result = previousValue - current;
            break;
          case "×":
            result = previousValue * current;
            break;
          case "÷":
            result = current !== 0 ? previousValue / current : 0;
            break;
          default:
            result = current;
        }
        const resultStr = formatNumber(result);
        setDisplay(resultStr);
        setPreviousValue(result);
        setHistory(`${formatNumber(previousValue)} ${operation} ${display} =`);
      } else {
        setPreviousValue(current);
      }
      setOperation(nextOp);
      setResetNext(true);
    },
    [display, previousValue, operation, resetNext],
  );

  const calculate = useCallback(() => {
    if (previousValue === null || !operation) return;
    const current = parseFloat(display);
    let result: number;
    switch (operation) {
      case "+":
        result = previousValue + current;
        break;
      case "-":
        result = previousValue - current;
        break;
      case "×":
        result = previousValue * current;
        break;
      case "÷":
        result = current !== 0 ? previousValue / current : 0;
        break;
      default:
        result = current;
    }
    setHistory(`${formatNumber(previousValue)} ${operation} ${display} =`);
    setDisplay(formatNumber(result));
    setPreviousValue(null);
    setOperation(null);
    setResetNext(true);
  }, [display, previousValue, operation]);

  const percentage = useCallback(() => {
    const current = parseFloat(display);
    setDisplay(formatNumber(current / 100));
  }, [display]);

  const toggleSign = useCallback(() => {
    const current = parseFloat(display);
    setDisplay(formatNumber(current * -1));
  }, [display]);

  const backspace = useCallback(() => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  }, [display]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") inputDigit(e.key);
      else if (e.key === ".") inputDecimal();
      else if (e.key === "+") performOperation("+");
      else if (e.key === "-") performOperation("-");
      else if (e.key === "*") performOperation("×");
      else if (e.key === "/") { e.preventDefault(); performOperation("÷"); }
      else if (e.key === "Enter" || e.key === "=") calculate();
      else if (e.key === "Escape") clear();
      else if (e.key === "Backspace") backspace();
      else if (e.key === "%") percentage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputDigit, inputDecimal, performOperation, calculate, clear, backspace, percentage]);

  const buttons: { label: string; action: () => void; variant?: string }[] = [
    { label: "MC", action: () => setMemory(0), variant: "memory" },
    { label: "MR", action: () => { setDisplay(formatNumber(memory)); setResetNext(true); }, variant: "memory" },
    { label: "M+", action: () => setMemory(memory + parseFloat(display)), variant: "memory" },
    { label: "M−", action: () => setMemory(memory - parseFloat(display)), variant: "memory" },
    { label: "%", action: percentage, variant: "func" },
    { label: "CE", action: () => { setDisplay("0"); setResetNext(false); }, variant: "func" },
    { label: "C", action: clear, variant: "func" },
    { label: "⌫", action: backspace, variant: "func" },
    { label: "1/x", action: () => { const v = parseFloat(display); if (v !== 0) setDisplay(formatNumber(1 / v)); }, variant: "func" },
    { label: "x²", action: () => { const v = parseFloat(display); setDisplay(formatNumber(v * v)); }, variant: "func" },
    { label: "√", action: () => { const v = parseFloat(display); setDisplay(formatNumber(Math.sqrt(v))); }, variant: "func" },
    { label: "÷", action: () => performOperation("÷"), variant: "op" },
    { label: "7", action: () => inputDigit("7") },
    { label: "8", action: () => inputDigit("8") },
    { label: "9", action: () => inputDigit("9") },
    { label: "×", action: () => performOperation("×"), variant: "op" },
    { label: "4", action: () => inputDigit("4") },
    { label: "5", action: () => inputDigit("5") },
    { label: "6", action: () => inputDigit("6") },
    { label: "−", action: () => performOperation("-"), variant: "op" },
    { label: "1", action: () => inputDigit("1") },
    { label: "2", action: () => inputDigit("2") },
    { label: "3", action: () => inputDigit("3") },
    { label: "+", action: () => performOperation("+"), variant: "op" },
    { label: "±", action: toggleSign },
    { label: "0", action: () => inputDigit("0") },
    { label: ".", action: inputDecimal },
    { label: "=", action: calculate, variant: "equals" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#1C1C1E]">
      {/* Display */}
      <div className="px-5 pt-3 pb-1 text-right">
        {history && (
          <div className="text-[12px] text-[#8E8E93] h-4 truncate">{history}</div>
        )}
        <div
          className="text-[36px] font-light text-white leading-tight truncate"
          style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}
        >
          {display}
        </div>
      </div>

      {/* Buttons Grid */}
      <div className="flex-1 grid grid-cols-4 gap-[1px] p-2 pt-1">
        {buttons.map((btn, i) => (
          <button
            key={i}
            onClick={btn.action}
            className={`flex items-center justify-center rounded-[6px] text-[14px] font-medium transition-all active:scale-95 ${
              btn.variant === "op"
                ? "bg-[#FF9F0A] text-white hover:bg-[#FFB340]"
                : btn.variant === "equals"
                  ? "bg-[#FF9F0A] text-white hover:bg-[#FFB340]"
                  : btn.variant === "func"
                    ? "bg-[#505052] text-white hover:bg-[#636366]"
                    : btn.variant === "memory"
                      ? "bg-[#505052] text-[#8E8E93] hover:bg-[#636366] text-[11px]"
                      : "bg-[#333336] text-white hover:bg-[#48484A]"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function formatNumber(n: number): string {
  if (Number.isNaN(n) || !Number.isFinite(n)) return "Error";
  const str = n.toPrecision(12);
  return parseFloat(str).toString();
}
