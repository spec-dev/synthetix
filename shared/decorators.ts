import { OnEvent } from '@spec.dev/core'

export const OnCoreEvent = (name, opts?) => OnEvent(`synthetixv3.Core.${name}`, opts)