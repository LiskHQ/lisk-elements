/*
 * Copyright © 2018 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 *
 */

/**
 * The purpose of the PeerPool
 */
/* tslint:disable:variable-name */
import { EventEmitter } from 'events';
import http, { Server } from 'http';
import querystring from 'querystring';
import socketClusterServer from 'socketcluster-server';
import { PeerTransportError } from './errors';
import { Peer } from './peer';

export const EVENT_INBOUND_PEER_FAIL = 'inboundPeerFail';
export const EVENT_NEW_INBOUND_PEER = 'newInboundPeer';
export const EVENT_NEW_PEER = 'newPeer';

export interface PeerPoolConfig {
	readonly blacklistedPeers?: ReadonlyArray<string>;
	readonly connectTimeout: number;
	readonly ipAddress?: string;
	readonly seedPeers: ReadonlyArray<string>;
	readonly wsEngine?: string;
	readonly wsPort: number;
}

export class PeerPool extends EventEmitter {
	private readonly _config: PeerPoolConfig;
	private readonly _httpServer: Server;
	private readonly _newPeers: Map<string, Peer>;
	/* tslint:disable:next-line: no-any */
	private readonly _scServer: any;
	private readonly _triedPeers: Map<string, Peer>;

	public constructor(config: PeerPoolConfig) {
		super();

		this._config = config;
		this._httpServer = http.createServer();
		this._newPeers = new Map();
		this._scServer = socketClusterServer.attach(this._httpServer);
		this._triedPeers = new Map();

		this._handleInboundConnections(this._scServer);
	}

	public get newPeers(): ReadonlyArray<Peer> {
		return Array.from(this._newPeers.values());
	}

	public get triedPeers(): ReadonlyArray<Peer> {
		return Array.from(this._triedPeers.values());
	}

	// TODO: Connect to seed nodes and start discovery process.
	public async start(): Promise<void> {
		/* tslint:disable:next-line: no-unused-expression */
		this._config; // TODO: Connect to seed nodes from this._config

		return Promise.resolve();
	}

	// TODO
	/* tslint:disable:next-line: prefer-function-over-method */
	public async stop(): Promise<void> {
		return Promise.resolve();
	}

	private _addInboundPeerToMaps(peer: Peer): void {
		const peerId: string = peer.id;

		if (this._triedPeers.has(peerId)) {
			const error: PeerTransportError = new PeerTransportError(
				`Received inbound connection from peer ${peerId} which is already in our triedPeers map.`,
				peerId,
			);
			this.emit(EVENT_INBOUND_PEER_FAIL, error);
		} else if (this._newPeers.has(peerId)) {
			const error: PeerTransportError = new PeerTransportError(
				`Received inbound connection from peer ${peerId} which is already in our newPeers map.`,
				peerId,
			);
			this.emit(EVENT_INBOUND_PEER_FAIL, error);
		} else {
			this._newPeers.set(peerId, peer);
			super.emit(EVENT_NEW_INBOUND_PEER, peer);
			super.emit(EVENT_NEW_PEER, peer);
		}
	}

	private _handleInboundConnections(scServer: any): void {
		scServer.on('connection', (socket: any) => {
			const queryObject: any = querystring.parse(socket.request.url);
			const peer: Peer = new Peer({
				clock: new Date(),
				height: 0,
				id: `${socket.remoteAddress}:${queryObject.wsPort}`,
				inboundSocket: socket,
				ipAddress: socket.remoteAddress,
				os: queryObject.os,
				version: queryObject.version,
				wsPort: queryObject.wsPort,
			});
			this._addInboundPeerToMaps(peer);
		});
	}
}