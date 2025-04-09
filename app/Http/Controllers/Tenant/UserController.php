<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant\User;
use App\Services\IdentityFactory;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    const X_ACCOUNTAK_ONBOARDING = 'X-ACCOUNTAK-ONBOARDING';

    public function login(Request $request): Response
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $user = User::where('id', Auth::user()->id)
                ->first();
            $token = $user->createToken('api_token');
            $request->session()->regenerate();
            $organization = tenant();
            Log::info($organization, [__LINE__, __FILE__]);
            $response = response([
                'success' => true,
                'token' => $token->plainTextToken,
                'redirectTo' => $organization->onboarded ? '/' : '/options/onboard',
                'identity' => (new IdentityFactory($user))->toArray()]);
            if (! $organization->onboarded) {
                return $response->cookie(self::X_ACCOUNTAK_ONBOARDING, ! $organization->onboarded);
            }

            return $response;
            // return redirect()->intended(route('home'));
        }

        return response('The provided credentials do not match our records.', 401);
        // return back()->withErrors([
        //     'email' => 'The provided credentials do not match our records.',
        // ]);
    }

    public function isAuthenticated(Request $request): Response
    {
        Log::info($request->user(), [__LINE__, __FILE__]);
        return response(['success' => $request->user() ? true : false]);
    }

    public function autologin(Request $request): Response
    {
        return $request->user() ?
                response('success', 200)
                : response('fail', 401);
    }
}
