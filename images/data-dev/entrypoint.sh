pnpm run --filter compile dev &

VITE_BUNDLE_SSE=true VITE_BUNDLE_HOST=/bundle pnpm run --filter viewer dev --host
