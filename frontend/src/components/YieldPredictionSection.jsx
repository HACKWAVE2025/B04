import React from "react";

export function YieldPredictionSection({
  title,
  description,
  icon,
  buttonText,
  onButtonClick,
  outputText,
  loading = false,
}) {
  const isPrimitive = typeof outputText === "string" || typeof outputText === "number";
  const isElement = React.isValidElement(outputText);

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6bc83f]/10 via-white to-[#2d511c]/10 dark:from-[#6bc83f]/5 dark:via-neutral-900 dark:to-[#2d511c]/5 border-2 border-[#6bc83f]/50 dark:border-[#6bc83f]/30 shadow-xl hover:shadow-2xl transition-all duration-300">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#6bc83f]/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#2d511c]/20 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative p-8 lg:p-10">
          {/* Header with Badge */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-[#6bc83f] to-[#2d511c] text-white shadow-lg">
                {icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-[#6bc83f] to-[#2d511c] text-transparent bg-clip-text">
                    {title}
                  </h3>
                  <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-[#6bc83f] to-[#2d511c] text-white rounded-full">
                    AI
                  </span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">{description}</p>
              </div>
            </div>
          </div>

          {/* Output Area - Expanded */}
          <div className="mb-6 rounded-2xl bg-white dark:bg-neutral-800 border-2 border-[#6bc83f]/30 dark:border-[#6bc83f]/20 min-h-[200px] p-6 shadow-inner">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 h-full">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-[#6bc83f]/30 border-t-[#6bc83f] rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-b-[#2d511c] rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">
                  Analyzing data and generating yield prediction...
                </p>
              </div>
            ) : (
              <div className="w-full">
                {isPrimitive ? (
                  <div className="text-neutral-700 dark:text-neutral-200 text-base leading-relaxed whitespace-pre-wrap">
                    {outputText || (
                      <div className="text-center text-neutral-500 dark:text-neutral-400">
                        <p className="text-lg font-medium mb-2">Complete all analyses above</p>
                        <p className="text-sm">Generate a comprehensive yield prediction based on all collected data</p>
                      </div>
                    )}
                  </div>
                ) : isElement ? (
                  <div className="w-full">{outputText}</div>
                ) : outputText ? (
                  <pre className="text-neutral-700 dark:text-neutral-200 text-sm whitespace-pre-wrap text-left max-h-64 overflow-auto p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg w-full">
                    {JSON.stringify(outputText, null, 2)}
                  </pre>
                ) : (
                  <div className="text-center text-neutral-500 dark:text-neutral-400">
                    <p className="text-lg font-medium mb-2">📊 Complete all analyses above</p>
                    <p className="text-sm">Generate a comprehensive yield prediction based on all collected data</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Button - Enhanced */}
          <button
            type="button"
            onClick={(e) => onButtonClick?.(e)}
            className="w-full lg:w-auto lg:px-12 rounded-xl bg-gradient-to-r from-[#6bc83f] to-[#2d511c] hover:from-[#2d511c] hover:to-[#6bc83f] text-white font-bold text-lg py-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            disabled={loading}
          >
            {buttonText}
          </button>

          {/* Info Note */}
          <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400 text-center lg:text-left">
            💡 This prediction combines all the data from crop identification, disease detection, weather, and recommendations above
          </p>
        </div>
      </div>
    </div>
  );
}
