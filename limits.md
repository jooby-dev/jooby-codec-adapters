# Limits

| Name                                   | Limits                                          | Additional info                                                                                                                                                                       |
| -------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ChirpStack                             | no hard limits for size <br> may be time limits |                                                                                                                                                                                       |
| TagoIO (payload parser)                | `65536` bytes                                   | [source 1](https://help.tago.io/portal/en/community/topic/in-depth-guide-to-payload-parser), [source 2](https://help.tago.io/portal/en/kb/articles/212-parser-vs-analysis-comparison) |
| ThingPark                              | `50000` bytes (not official info)               |                                                                                                                                                                                       |
| ThingsBoard (data converter)           | `50000` bytes (github) <br> `64` Mb RAM         | [source](https://github.com/thingsboard/thingsboard/pull/7350)                                                                                                                        |
| The Things Network (payload formatter) | `40960` bytes                                   | [source](https://www.thethingsindustries.com/docs/integrations/payload-formatters/javascript/)                                                                                        |


## Build sizes

### TagoIO

- analog uplink: `30459`

### ThingPark

- analog full: `47662`, `28198` (partial command set)

### ThingsBoard

- analog downlink: `27798`, `25386` (partial command set)
- analog uplink: `39733`, `32260` (partial command set)
- analog uplink (loriot): `39768`
- mtx1 downlink: `31213`, `17529` (partial command set)
- mtx1 uplink: `43971`, `25435` (partial command set)
- mtx3 downlink: `50115`, `34568` (partial command set)
- mtx3 uplink: `61832`, `41211` (partial command set)

### The Things Network

- analog downlink: `23897`, `22044` (partial command set)
- analog uplink: `33987`, `27860` (partial command set)
