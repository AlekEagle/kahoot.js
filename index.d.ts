import EventEmitter from "node:events";
import { ClientRequest, ClientRequestArgs } from "node:http";
import { ClientOptions } from "ws";

declare function Kahoot(options?: Kahoot.Defaults): Kahoot.Client;

declare namespace Kahoot {
	export interface Defaults {
		Options: {
			ChallengeAutoContinue: boolean;
			ChallengeGetFullScore: boolean;
			ChallengeAlwaysCorrect: boolean;
			ChallengeUseStreakBonus: boolean;
			ChallengeWaitForInput: boolean;
			ChallengeScore: number;
		};

		Modules: {
			extraData: boolean;
			feedback: boolean;
			gameReset: boolean;
			quizStart: boolean;
			quizEnd: boolean;
			podium: boolean;
			timeOver: boolean;
			reconnect: boolean;
			questionReady: boolean;
			questionStart: boolean;
			questionEnd: boolean;
			nameAccept: boolean;
			teamAccept: boolean;
			teamTalk: boolean;
			backup: boolean;
			answer: boolean;
		};

		proxy(options: ClientRequestArgs): ClientRequestArgs | ClientRequest;

		wsproxy(options: ClientOptions): WsProxyReturn;
	}

	export interface WsProxyReturn {
		address: string;
		protocols: string[];
		options: ClientOptions;
	}

	export interface Data {
		totalScore: number;
		streak: number;
		rank: number;
	}

	export interface Quiz {
		quizQuestionAnswers: number[];
		questionCount: number;
		currentQuestion: {
			questionIndex: number;
			index: number;
			gameBlockType: string;
			type: string;
			answer?: Client["answer"];
		};
	}

	export interface LiveEventTimetrack {
		channel: string;
		ext: {
			timetrack: number;
		};
		id: string;
		successful: boolean;
	}

	export interface Nemesis {
		name: string;
		isGhost: boolean;
		totalScore: number;
	}

	export interface FeedbackEventData {
		quizType: string;
	}

	export interface JoinedEventData {
		challenge: () => string;
		namerator: boolean;
		participantId: boolean;
		smartPractice: boolean;
		twoFactorAuth: boolean;
		gameMode?: string;
	}

	export interface NameAcceptEventData {
		playerName: string;
		quizType: string;
		playerV2: boolean;
	}

	export interface QuestionEndEventData {
		choice: number | number[] | string;
		type: string;
		isCorrect: boolean;
		text: string;
		receivedTime: number;
		pointsQuestion: boolean;
		points: number;
		correctAnswers: string[];
		correctChoices: number[];
		totalScore: number;
		rank: number;
		pointsData: PointsData;
		nemesis: Nemesis;
	}

	export interface QuestionReadyEventData {
		questionIndex: number;
		gameBlockType: string;
		gameBlockLayout: string;
		quizQuestionAnswers: number[];
		timeLeft: number;
	}

	export interface QuestionStartEventData {
		questionIndex: number;
		gameBlockType: string;
		gameBlockLayout: string;
		quizQuestionAnswers: number[];
		timeAvailable: number;
	}

	export interface QuizEndEventData {
		rank: number;
		cid: string;
		correctCount: number;
		incorrectCount: number;
		isKicked: boolean;
		isGhost: boolean;
		unansweredCount: number;
		playerCount: number;
		startTime: number;
		quizId: string;
		name: string;
		totalScore: number;
		hostId: string;
		challengeId: string | null;
		isOnlyNonPointGameBlockKahoot: boolean;
	}

	export interface QuizStartEventData {
		quizType: string;
		quizQuestionAnswers: number[];
	}

	export interface TeamAcceptEventData {
		memberNames: string[];
		recoveryData: any;
	}

	export interface TeamTalkEventData {
		questionIndex: number;
		quizQuestionAnswers: number[];
		gameBlockType: string;
		gameBlockLayout: string;
		teamTalkDuration: number;
	}

	export interface TimeOverEventData {
		questionNumber: number;
	}

	export interface PointsData {
		questionPoints: number;
		totalPointsWithBonuses: number;
		totalPointsWithoutBonuses: number;
		answerStreakPoints: StreakPoints;
	}

	export interface StreakPoints {
		streakLevel: number;
		streakBonus: number;
		totalStreakBonus: number;
		previousStreakLevel: number;
		previousStreakBonus: number;
	}

	export interface Events {
		Disconnect: (reason: string) => void;
		Feedback: (data: FeedbackEventData) => void;
		GameReset: () => void;
		Joined: (data: JoinedEventData) => void;
		NameAccept: (data: NameAcceptEventData) => void;
		Podium: (
			podiumMedalType: "gold" | "silver" | "bronze" | undefined | null
		) => void;
		QuestionEnd: (data: QuestionEndEventData) => void;
		QuestionReady: (data: QuestionReadyEventData) => void;
		QuestionStart: (data: QuestionStartEventData) => void;
		QuizEnd: (data: QuizEndEventData) => void;
		QuizStart: (data: QuizStartEventData) => void;
		RecoveryData: (data: any) => void;
		TeamAccept: (data: TeamAcceptEventData) => void;
		TeamTalk: (data: TeamTalkEventData) => void;
		TimeOver: (data: TimeOverEventData) => void;
		TwoFactorCorrect: () => void;
		TwoFactorReset: () => void;
		TwoFactorWrong: () => void;
	}

	export class Client extends EventEmitter {
		constructor(options?: Defaults);

		static defaults(options: Defaults): Client;
		static join(): { client: Client; event: Promise<LiveEventTimetrack> };

		answer(choice: number | number[] | string): Promise<LiveEventTimetrack>;

		answerTwoFactorAuth(steps?: number[]): Promise<LiveEventTimetrack>;

		join(
			pin: string,
			name: string,
			team?: string[] | boolean
		): Promise<JoinedEventData>;

		joinTeam(team?: string[]): Promise<LiveEventTimetrack>;

		leave(): void;

		next(): void;

		reconnect(pin?: number | string, cid?: string | number): Promise<void>;

		sendFeedback(
			fun: 1 | 2 | 3 | 4 | 5,
			learn: 0 | 1,
			recommend: 0 | 1,
			overall: -1 | 0 | 1
		): Promise<LiveEventTimetrack>;
		on<K extends keyof Events>(event: K, listener: Events[K]): this;
		once<K extends keyof Events>(event: K, listener: Events[K]): this;
		off<K extends keyof Events>(event: K, listener: Events[K]): this;
		emit<K extends keyof Events>(
			event: K,
			...args: Parameters<Events[K]>
		): boolean;
		addListener<K extends keyof Events>(
			eventName: K,
			listener: Events[K]
		): this;
		removeListener<K extends keyof Events>(
			eventName: K,
			listener: Events[K]
		): this;
		removeAllListeners<K extends keyof Events>(eventName?: K): this;
		listeners<K extends keyof Events>(eventName: K): Array<Events[K]>;
		rawListeners<K extends keyof Events>(eventName: K): Array<Events[K]>;
		eventNames(): (keyof Events)[];
		listenerCount<K extends keyof Events>(eventName: K): number;
		prependListener<K extends keyof Events>(
			eventName: K,
			listener: Events[K]
		): this;
		prependOnceListener<K extends keyof Events>(
			eventName: K,
			listener: Events[K]
		): this;
	}
}

export = Kahoot;
